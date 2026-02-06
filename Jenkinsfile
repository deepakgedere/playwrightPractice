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
                bat 'npx playwright test --reporter=line,html'
            }
        }

        
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**/*.*', fingerprint: true, onlyIfSuccessful: false
            }
        }

    }

    post {
        always {
            echo "Build Finished"
        }
    }
}
