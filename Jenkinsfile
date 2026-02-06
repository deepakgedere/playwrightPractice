pipeline {
    agent any

    tools {
        nodejs "node18"
    }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    durabilityHint('MAX_SURVIVABILITY')
    disableConcurrentBuilds()
    timeout(time: 60, unit: 'MINUTES')
  }

  
    environment {
        // Caches for faster builds (safe on Windows)
        NPM_CONFIG_CACHE = "${WORKSPACE}\\.npm"
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\pw-browsers"
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "0"
        // Folder for JUnit XML results
        TEST_RESULTS_DIR = "test-results\\junit"
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
                // Retry npm install (network hiccups are common on Windows)
                retry(2) {
                bat """
                    echo Node version:
                    node -v
                    echo NPM version:
                    npm -v

                    rem Use clean install for CI
                    npm ci

                    rem Install/ensure Playwright browsers into cache path
                    set PLAYWRIGHT_BROWSERS_PATH=%PLAYWRIGHT_BROWSERS_PATH%
                    npx playwright install
                """
                }
            }
        }
                
        stage('Static Analysis') {
            when { expression { return fileExists('package.json') } }
            steps {
                // Lint & typecheck only if scripts exist (avoid failing if missing)
                bat """
                for /f "delims=" %%i in ('npm pkg get scripts.lint ^| powershell -Command "(Get-Content -Raw).Trim('\"')"') do set HAS_LINT=%%i
                if not "%HAS_LINT%"=="undefined" (
                    echo Running ESLint...
                    call npm run lint || exit /b 1
                ) else (
                    echo No 'lint' script found, skipping.
                )

                for /f "delims=" %%i in ('npm pkg get scripts.typecheck ^| powershell -Command "(Get-Content -Raw).Trim('\"')"') do set HAS_TC=%%i
                if not "%HAS_TC%"=="undefined" (
                    echo Running TypeScript typecheck...
                    call npm run typecheck || exit /b 1
                ) else (
                    echo No 'typecheck' script found, skipping.
                )
                """
            }
        }

        stage('Build') {
        when { expression { return fileExists('package.json') } }
        steps {
            bat """
            for /f "delims=" %%i in ('npm pkg get scripts.build ^| powershell -Command "(Get-Content -Raw).Trim('\"')"') do set HAS_BUILD=%%i
            if not "%HAS_BUILD%"=="undefined" (
                echo Building app...
                call npm run build || exit /b 1
            ) else (
                echo No 'build' script found, skipping.
            )
            """
        }
        }

        stage('Tests: Playwright (Parallel by Project)') {
            parallel {
                stage('Chromium') {
                    steps {
                        // Generate JUnit XML and HTML report; keep retries to surface flakiness
                        retry(2) {
                        bat """
                            set PLAYWRIGHT_BROWSERS_PATH=%PLAYWRIGHT_BROWSERS_PATH%
                            npx playwright test --project=chromium --reporter=junit,line --output=%CD%\\test-results\\out_chromium --workers=50% --retries=1 --reporter=junit
                            if not exist "%TEST_RESULTS_DIR%\\chromium" mkdir "%TEST_RESULTS_DIR%\\chromium"
                            move /Y test-results\\out_chromium\\*.xml "%TEST_RESULTS_DIR%\\chromium" >nul 2>&1
                        """
                        }
                    }
                }
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**/*.*', fingerprint: true, onlyIfSuccessful: false
            }
        }

        stage('Generate Playwright HTML Report') {
            steps {
                // Ensure HTML report is generated even if previous stages passed w/ junit only
                bat """
                set PLAYWRIGHT_BROWSERS_PATH=%PLAYWRIGHT_BROWSERS_PATH%
                npx playwright show-report --report-dir="%PW_REPORT_DIR%" || echo Report already present/generated by last run.
                """
            }
        }
    }
    

    
    post {
        always {
        // Publish JUnit results (won’t fail build if none found)
        junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'

        // Archive Playwright HTML report and useful artifacts
        archiveArtifacts artifacts: 'playwright-report/**, test-results/**, screenshots/**, videos/**', fingerprint: true, onlyIfSuccessful: false

        // Publish HTML report to Jenkins UI (requires "HTML Publisher" plugin)
        publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Report',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: true
        ])
        }

        success {
        // Optional: Slack notification (requires Slack plugin + credentials)
        // slackSend(channel: '#qa-alerts', message: "✅ Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} — ${env.BUILD_URL}")
        }

        unstable {
        // slackSend(channel: '#qa-alerts', message: "🟧 Build UNSTABLE: ${env.JOB_NAME} #${env.BUILD_NUMBER} — ${env.BUILD_URL}")
        }

        failure {
        // slackSend(channel: '#qa-alerts', message: "❌ Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} — ${env.BUILD_URL}")
        }
    }
}
