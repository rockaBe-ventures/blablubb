import {
  graphql,
  GraphqlResponseError,
  GraphQlQueryResponseData,
} from "@octokit/graphql";
import "dotenv/config";

// github organization ID for rockaBe-ventures
const organizationID = "O_kgDOAM8ylA";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.READ_GITHUB_TOKEN}`,
  },
});

const query = `
query lastPrReviews($organizationID: ID!, $number: Int = 20) {
  viewer {
    login
    contributionsCollection(organizationID: $organizationID) {
      pullRequestReviewContributions(first: $number) {
        edges {
          node {
            occurredAt
            repository {
              name
            }
            pullRequestReview {
              createdAt
              comments(last:20) {
                totalCount
                edges {
                  node {
                    bodyText
                    body
                    resourcePath
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

try {
  const {
    viewer: {
      contributionsCollection: {
        pullRequestReviewContributions: { edges },
      },
    },
  }: GraphQlQueryResponseData = await graphqlWithAuth({
    query,
    organizationID,
  });
  console.log(">>>>>>", JSON.stringify(edges, null, 2), "<<<<<<");
} catch (error) {
  if (error instanceof GraphqlResponseError) {
    console.log("Request failed:", error.request);
    console.log("error:message", error.message);
    console.log("error:data", error.data);
  } else {
    throw new Error("Something went wrong");
  }
}
