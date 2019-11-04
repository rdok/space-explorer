pipeline {
    agent { label "linux" }
    options {  buildDiscarder( logRotator( numToKeepStr: '30' ) ) }
    stages {
    stage('Notify Github') {
        steps {
            githubNotify account: 'rdok',
               context: 'CI',
               credentialsId: 'github-status-notifier',
               description: 'Jenkins',
               gitApiUrl: '',
               repo: 'space-explorer',
               sha: "${env.GIT_COMMIT}",
               status: 'PENDING',
               targetUrl: ''
        }
    }
        stage('Test API') {
         steps {
            dir('api') {
               ansiColor('xterm') {
                  sh '''
                     docker run --rm -v $(pwd):/app -w /app \
                     --user $(id -u):$(id -g) \
                     node:12-alpine \
                     sh -c "yarn install; yarn run jest --coverage --coverageDirectory='./report' --ci"
                  '''
                    } 
                }
            }
        }
    }
}
