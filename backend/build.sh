# exit on error
set -o errexit

# Install dependencies
yarn install

# Build the project
yarn build

# Start the application
yarn start