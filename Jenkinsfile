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
                // Use bat for Windows; tools{} puts Node on PATH
                bat 'npm install'
                // On Windows, do NOT use --with-deps
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test --reporter=line'
            }
        }

        stage('Archive Report') {
            steps {
                // Forward slashes are fine for Ant-style patterns on Windows too
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
