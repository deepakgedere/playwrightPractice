pipeline {
    agent any

    tools {
        nodejs "node18"
    }

    environment {
        // Caches for faster builds (safe on Windows)
        NPM_CONFIG_CACHE = "${WORKSPACE}\\.npm"
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\pw-browsers"
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "0"
        // Where Playwright HTML report is generated (default is 'playwright-report')
        PW_REPORT_DIR = "playwright-report"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/deepakgedere/playwrightPractice.git'
            }
        }

        stage('Prepare Workspace & Cache') {
            steps {
                bat """
                if not exist "%NPM_CONFIG_CACHE%" mkdir "%NPM_CONFIG_CACHE%"
                if not exist "%PLAYWRIGHT_BROWSERS_PATH%" mkdir "%PLAYWRIGHT_BROWSERS_PATH%"
                if not exist "%TEST_RESULTS_DIR%" mkdir "%TEST_RESULTS_DIR%"
                """
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
