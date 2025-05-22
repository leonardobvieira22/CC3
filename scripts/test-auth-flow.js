#!/usr/bin/env node

/**
 * Test script for authentication flow
 *
 * This script tests the complete authentication flow:
 * 1. User registration
 * 2. Email verification
 * 3. Login
 * 4. Password reset
 *
 * Usage:
 * node scripts/test-auth-flow.js
 */

const fetch = require('node-fetch');
const readline = require('readline');

const baseUrl = 'http://localhost:3000/api/auth';
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'Test@123456';
const testName = 'Usuário de Teste';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Wait for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Log with colors
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Test user registration
async function testRegistration() {
  log('\n🔹 STEP 1: TESTING USER REGISTRATION', 'cyan');
  log(`Using test email: ${testEmail}`, 'yellow');

  try {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());

    const response = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        cpf: '123.456.789-00', // Test CPF
        dateOfBirth: birthDate.toISOString().split('T')[0],
        termsAccepted: true,
        privacyAccepted: true
      })
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Registration Successful', 'green');
      log(`Message: ${data.message}`, 'green');

      // Check for verification email info
      if (data.requiresEmailVerification) {
        log('✅ Email verification required, as expected', 'green');
      } else {
        log('⚠️ Email verification not required, which is unexpected', 'yellow');
      }

      return data;
    } else {
      log('❌ Registration Failed', 'red');
      log(`Error: ${data.message}`, 'red');
      if (data.errors) {
        log('Validation errors:', 'red');
        console.error(data.errors);
      }
      return null;
    }
  } catch (error) {
    log('❌ Registration Failed with an exception', 'red');
    console.error(error);
    return null;
  }
}

// Test email verification
async function testEmailVerification() {
  log('\n🔹 STEP 2: TESTING EMAIL VERIFICATION', 'cyan');

  // In a real scenario, the user would receive an email with a verification link
  // Since we can't automatically click that link in this test, we'll check if the API is properly set up
  log('In a real scenario, the user would click a verification link from their email', 'yellow');
  log('Checking for Ethereal test email in the console output...', 'yellow');

  const verificationToken = await prompt('Please enter the verification token from the console (or press enter to skip): ');

  if (!verificationToken) {
    log('⚠️ Skipping email verification test', 'yellow');
    return false;
  }

  try {
    const response = await fetch(`${baseUrl}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verificationToken })
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Email Verification Successful', 'green');
      log(`Message: ${data.message}`, 'green');
      return true;
    } else {
      log('❌ Email Verification Failed', 'red');
      log(`Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Email Verification Failed with an exception', 'red');
    console.error(error);
    return false;
  }
}

// Test login
async function testLogin(emailVerified = false) {
  log('\n🔹 STEP 3: TESTING LOGIN', 'cyan');

  if (!emailVerified) {
    log('⚠️ Email not verified yet, login might fail as expected', 'yellow');
  }

  try {
    // We can't directly test NextAuth API endpoints, so we'll just report that manual testing is needed
    log('For a complete test, manually try to login at: http://localhost:3000/auth/login', 'yellow');
    log(`Email: ${testEmail}`, 'yellow');
    log(`Password: ${testPassword}`, 'yellow');

    // Just for completeness, simulate what happens in the login component
    const shouldContinue = await prompt('Did manual login work as expected? (y/n): ');

    if (shouldContinue.toLowerCase() === 'y') {
      log('✅ Login test passed based on manual verification', 'green');
      return true;
    } else {
      log('❌ Login test failed based on manual verification', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Login Test Failed with an exception', 'red');
    console.error(error);
    return false;
  }
}

// Test password reset flow
async function testPasswordReset() {
  log('\n🔹 STEP 4: TESTING PASSWORD RESET', 'cyan');

  try {
    const response = await fetch(`${baseUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Password Reset Request Successful', 'green');
      log(`Message: ${data.message}`, 'green');
      log('Check the console for the Ethereal email with the reset link', 'yellow');

      const resetToken = await prompt('Please enter the reset token from the console (or press enter to skip): ');

      if (!resetToken) {
        log('⚠️ Skipping password reset completion test', 'yellow');
        return false;
      }

      // Test password reset completion
      const newPassword = 'NewTest@123456';
      const resetResponse = await fetch(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          password: newPassword,
          confirmPassword: newPassword
        })
      });

      const resetData = await resetResponse.json();

      if (resetResponse.ok) {
        log('✅ Password Reset Completion Successful', 'green');
        log(`Message: ${resetData.message}`, 'green');
        log(`New password set to: ${newPassword}`, 'green');
        return true;
      } else {
        log('❌ Password Reset Completion Failed', 'red');
        log(`Error: ${resetData.message}`, 'red');
        return false;
      }
    } else {
      log('❌ Password Reset Request Failed', 'red');
      log(`Error: ${data.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Password Reset Test Failed with an exception', 'red');
    console.error(error);
    return false;
  }
}

// Main test function
async function runAuthTests() {
  log('🧪 STARTING AUTHENTICATION FLOW TESTS', 'bright');
  log('This script will test the complete authentication flow', 'bright');
  log('-----------------------------------------------', 'bright');

  try {
    // 1. Test Registration
    const registrationResult = await testRegistration();
    if (!registrationResult) {
      log('❌ Registration failed, stopping tests', 'red');
      return;
    }

    // 2. Test Email Verification
    const emailVerified = await testEmailVerification();

    // 3. Test Login (might fail if email not verified, which is expected)
    await testLogin(emailVerified);

    // 4. Test Password Reset
    await testPasswordReset();

    log('\n-----------------------------------------------', 'bright');
    log('🎉 AUTH FLOW TESTS COMPLETED', 'bright');
    log('Note: These are basic tests. For a complete verification, manual testing is recommended.', 'yellow');
  } catch (error) {
    log('❌ Tests failed with an unexpected error', 'red');
    console.error(error);
  } finally {
    rl.close();
  }
}

// Run the tests
runAuthTests();
