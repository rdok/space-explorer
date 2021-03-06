pipeline {
    agent { label "linux" }
    options {  buildDiscarder( logRotator( numToKeepStr: '5' ) ) }
    stages {
    stage('Notify Github') {
        steps {
            githubNotify account: 'rdok',
               context: 'CI',
               credentialsId: 'github-status-notifier',
               description: 'Jenkins',
               repo: 'space-explorer',
               sha: "${env.GIT_COMMIT}",
               status: 'PENDING'
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
                        sh -c "yarn install; yarn run jest --ci"
                     '''
                       } 
                   }
               }
        }
        stage('Test React') { steps { dir('react') { ansiColor('xterm') {
            sh '''
            docker run --rm -v $(pwd):/app -w /app \
               -e CI=true \
               --user $(id -u):$(id -g) \
               node:12-alpine \
               sh -c "yarn install; yarn run test --ci"
            '''
        } } } }
    }
    post {
        failure {
            githubNotify account: 'rdok',
               context: 'CI',
               credentialsId: 'github-status-notifier',
               description: 'Jenkins',
               repo: 'space-explorer',
               sha: "${env.GIT_COMMIT}",
               status: 'FAILURE'
        }
        success {
            githubNotify account: 'rdok',
               context: 'CI',
               credentialsId: 'github-status-notifier',
               description: 'Jenkins',
               repo: 'space-explorer',
               sha: "${env.GIT_COMMIT}",
               status: 'SUCCESS'
        }
    }
}
