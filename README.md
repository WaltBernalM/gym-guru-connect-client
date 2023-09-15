# gym-guru-connect-client

## Introduction

### `Description`
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
This project is a one page website and uses Material UI components quite proficient with some animations using JSON files, and of course React components in jsx format.

### `Design justifications`
It was designed for two kinds of user and for a very specific application.
The goal is to serve as the common portal between the trainers/nutritionists and their customers, where they can both set appointments, hanlde nutrition plans and exercise plans.

### `Design application`
The two kind of users, as you may suspect, are Trainers and Trainees.
For a trainer, the application will provide a quite confortable interface working with medium to big screens, but, the trainer can still use it with a mobile device.
For a trainee, since is more often to them to consult in a mobile device, the interface will perform quite good in mobile, nevertheless, will look nice also in higher resolutions.

## Install

Dependencies:
- node 20.x
- npm 9.x

```sh
$ npm i
```

## Release

You can deploy this project with any host. But need to be careful with the process environment variables.
This project also need to have an API linked, which can be located at
[GymGuru server](https://github.com/WaltBernalM/gym-guru-connect-server)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Pages
| Page      | URL                  | Description           |
| --------- | -------------------- | --------------------- |
| HOME      | /                    | homepage              |
| SIGNUP    | /signup              | signup page           |
| LOGIN     | /login               | login page            |
| EXERCISES | /exercises           | exercise page         |
| MY OFFICE | /trainers/:trainerId | trainer's office page |
| MY PLAN   | /trainee/:traineeId  | trainee's plan page   |
