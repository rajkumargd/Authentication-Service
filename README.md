# Restaurant Review API

This project is a Restaurant Review API that allows users to register, login, manage restaurants, write reviews, and integrate with Google Places API.

## Stack

NodeJs, ExpressJs, MySql, DynamoDB

## Environment Setup

This project has designed to deploy **"Containerized Microservice Architecture"**
Following Instructions are common for all the repos

1. Clone the repository:
   ```
   git clone https://github.com/rajkumargd/Restaurent-Gateway.git
   git clone https://github.com/rajkumargd/Authentication-Service.git
   git clone https://github.com/rajkumargd/Restaurent-Service.git
   git clone https://github.com/rajkumargd/Review-Service.git

   ```

2. Install dependencies:

   * Local Machine
      ```
      npm install
      ```
   * Docker
      ```
      docker compose up
      ```

3. Set up environment variables:
   Rename a `.env.example` to `.env` file in the root directory and add your values:
   

## Running Locally

1. MySql and DynamoDb is required.

2. Google Place API is required.

3. Run the development server:

   * Local Machine
      ```
      npm run dev
      ```
   * Docker
      ```
      docker compose up
      ```

4. The API will be available at Local

   * Restaurant Gateway - `http://localhost:3000`
   * Authentication Service - `http://localhost:3001`
   * Restaurent Service - `http://localhost:3002`
   * Review Service - `http://localhost:3003`

## Running Tests

To run the test suite:

* Local Machine
   ```
   npm run test
   ```
* Docker
   You can update the Dockerfile.dev
   
   Change CMD ["npm", "run", "dev"] to 

   ```
   CMD ["npm", "run", "test"]
   ```

## Deployment Notes

  1. Ensure all environment variables are set in your production environment.
  2. Build the project:
     ```
     npm run build
     ```
  3. Start the production server (AWS):

     * Step 1: Build the docker image 
     ```
     docker build -f Dockerfile.prod  -t <image_tag_name> .
     
     //If you build machine from different architecture try following
  
     docker build --platform linux/amd64 -f Dockerfile.prod -t gateway-service .
  
     //OR
  
     docker buildx build --platform linux/amd64,linux/arm64 -t gateway-service .
     ```
  
     * Step 2: Tag the build image
     ```
     docker tag <image_tag_name>:latest <container_url>:latest
  
     //Example
     docker tag <image_tag_name>:latest <account_id>.dkr.ecr.<region>.amazonaws.com/<container_name>:latest
     ```
  
     * Step 3: Push the image to container
     ```
     
     docker push <container_url>:latest
  
     //Example
     docker push <account_id>.dkr.ecr.<region>.amazonaws.com/<container_name>:latest
     ```

## Postman Collection

You can find the Postman collection in Restaurant Gateway Repo root folder "Review-Aggregation.postman_collection"

## Improvements

Here are some potential improvements for the codebase:

1. Implement Swagger documentation for better API documentation.
2. Implement input validation using a library like class-validator or express-validator.
3. Implement OAuth2 and refresh tokens for better security.
4. Add more comprehensive error handling and logging.
5. Implement Cloudwatch to get errors into production
6. DTO & RO can be implemented
7. Deployment workflow to be added
8. Test case can be run in the workflow 