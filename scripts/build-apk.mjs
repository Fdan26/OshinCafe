// Builds the Android debug APKs without Android Studio.
// Usage: npm run apk            (both apps)
//        npm run apk -- customer (one app: customer | cafe)
import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync } from 'node:fs'

const apps = {
  customer: { task: 'assembleCustomerDebug', apk: 'customer/debug/app-customer-debug.apk', out: 'OshinCustomer.apk' },
  cafe: { task: 'assembleCafeDebug', apk: 'cafe/debug/app-cafe-debug.apk', out: 'OshinCafeStaff.apk' },
}

const requested = process.argv.slice(2)
const targets = requested.length ? requested : Object.keys(apps)
const gradlew = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew'
const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd })

mkdirSync('apk', { recursive: true })

for (const name of targets) {
  const app = apps[name]
  if (!app) throw new Error(`Unknown app "${name}". Use: ${Object.keys(apps).join(', ')}`)

  console.log(`\n=== Building ${name} ===`)
  // Each app gets its own web build, so it must be copied into Android right before its Gradle build
  run(`npx vite build --mode ${name}`)
  run('npx cap copy android')
  run(`${gradlew} ${app.task}`, 'android')
  copyFileSync(`android/app/build/outputs/apk/${app.apk}`, `apk/${app.out}`)
  console.log(`-> apk/${app.out}`)
}
