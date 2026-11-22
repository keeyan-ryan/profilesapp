import { defineBackend } from '@aws-amplify/backend';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const bucketDeploymentFunctions = backend.data.stack.node.findAll().filter(
  (resource): resource is CfnFunction =>
    resource instanceof CfnFunction &&
    resource.node.path.includes('Custom::CDKBucketDeployment'),
);

if (bucketDeploymentFunctions.length === 0) {
  throw new Error('Could not find the Amplify data bucket-deployment Lambda.');
}

for (const deploymentFunction of bucketDeploymentFunctions) {
  deploymentFunction.memorySize = 512;
}
