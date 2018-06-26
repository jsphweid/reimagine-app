#!/bin/bash

bucket_name=$(<~/.aws/main_bucket_name)
cloudfront_id=$(<~/.aws/main_cloudfront_id)

npm run build
aws s3 sync ./dist/ s3://${bucket_name}/reimagine --delete
aws cloudfront create-invalidation --distribution-id ${cloudfront_id} --paths "/*"