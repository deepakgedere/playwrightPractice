pipeline {
    agent any

    tools {
        nodejs "node18"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/deepakgedere/playwrightPractice.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=line'
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo "Build Finished"
        }
    }
}