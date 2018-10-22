#!/usr/bin/env groovy

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovy.json.JsonSlurperClassic
import java.text.SimpleDateFormat
import java.util.Date

pipeline {
	agent any
	options {
		disableConcurrentBuilds()
		buildDiscarder(logRotator(
			artifactDaysToKeepStr: "",
			artifactNumToKeepStr: "15",
			daysToKeepStr: "",
			numToKeepStr: "15"
		))
	}
	environment {
		JOB_PATH="${pwd()}"
		NODE_PATH="${env.JOB_PATH}/nodejs"
		NODE_URL='https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-x64.tar.xz'
		PATH="${env.PATH}:${env.NODE_PATH}/bin"
		AWS_SHARED_CREDENTIALS_FILE = "${env.JOB_PATH}/.awscredentials"
	}
	stages {
		stage('get secrets') {
			steps {
				script {
					dir(env.JOB_PATH) {
						def secrets = [
							[
								$class: 'VaultSecret',
								path: 'secret/zaleniumizing-nightwatchjs',
								secretValues: [
									[
										$class: 'VaultSecretValue',
										envVar: 'AWS_ACCESS_KEY_ID',
										vaultKey: 'AWS_ACCESS_KEY_ID'
									],
									[
										$class: 'VaultSecretValue',
										envVar: 'AWS_SECRET_ACCESS_KEY',
										vaultKey: 'AWS_SECRET_ACCESS_KEY'
									],
									[
										$class: 'VaultSecretValue',
										envVar: 'SCREENSHOT_BUCKET',
										vaultKey: 'SCREENSHOT_BUCKET'
									],
									[
										$class: 'VaultSecretValue',
										envVar: 'SCREENSHOT_PATH',
										vaultKey: 'SCREENSHOT_PATH'
									],
								]
							]
						]
						wrap([$class: 'VaultBuildWrapper', vaultSecrets: secrets]) {
							dir(env.JOB_PATH) {
								if (env.AWS_ACCESS_KEY_ID == "" || env.AWS_SECRET_ACCESS_KEY == "" ||
									env.SCREENSHOT_BUCKET == "" || env.SCREENSHOT_PATH == "") {
									sh "read empty secrets"
									sh "exit 1"
								}
								writeFile file: env.AWS_SHARED_CREDENTIALS_FILE, text: """[default]
aws_access_key_id = ${env.AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${env.AWS_SECRET_ACCESS_KEY}
region=us-west-2
output=json
"""
								bucketName = env.SCREENSHOT_BUCKET
								bucketPath = env.SCREENSHOT_PATH
							}
						}
					}
				}
			}
		}
		stage('get node') {
			steps {
				script {
					dir(env.JOB_PATH) {
						sh "mkdir -p ${env.NODE_PATH}"
						sh "wget -qO node.txz ${env.NODE_URL}"
						sh "tar xf node.txz -C ${env.NODE_PATH} --strip-components 1"
					}
				}
			}
		}
		stage('get deps') {
			steps {
				script {
					dir(env.JOB_PATH) {
						sh "${env.NODE_PATH}/bin/npm i"
					}
				}
			}
		}
		stage('test') {
			steps {
				script {
					dir(env.JOB_PATH) {
						sh "./node_modules/.bin/nightwatch tests/"
					}
				}
			}
		}
		stage("write report") {
			steps {
				script {
					dir(env.JOB_PATH) {
						def dateFormat = new SimpleDateFormat("yyyy-MM")
						def date = new Date()
						def dirName = dateFormat.format(date)

						def url = "s3://"
						url += "${bucketName}/"
						url += "${bucketPath}/"
						url += "${dirName}/"

						sh "aws s3 sync ./proof ${url}"
					}
				}
			}
		}
	}
	post {
		always {
			script {
				deleteDir()
				def alert = "${env.JOB_NAME} -> ${env.BUILD_NUMBER} is a ${currentBuild.result}"
				alert += " (<${env.BUILD_URL}|Open>)"
				notifySlack alert, 'meetuplol'
			}
		}
	}
}

def notifySlack(text, channel) {
	withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'slackHook')]) {
		def payload = "{\"text\":\"${text}\","
		payload += "\"channel\":\"${channel}\","
		payload += "\"username\":\"${Jenkins}\","
		payload += "\"attachments\":[]}"
		sh "curl -X POST --data-urlencode \'payload=${payload}\' ${slackHook}"
	}
}
