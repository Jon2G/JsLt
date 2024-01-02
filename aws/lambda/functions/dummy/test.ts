import { lt_fetch } from "shared/metricsLayer/fetchLayer";
import { faker, tr } from "@faker-js/faker";
import { authenticator } from "otplib";

export async function testRun() {
  await Promise.resolve();
  console.log("hello world");

  const ip = process.env["TESTING_IP"];
  console.log(`Testing ip:${ip}`);

  const name = faker.internet.userName();
  console.log(`Testing name:${name}`);
  const email = faker.internet.email();
  console.log(`Testing email:${email}`);
  const password = faker.internet.password();
  console.log(`Testing password:${password}`);

  const user = await signUp(name, email, password);
  const secret = user.secret;
  console.log(`Testing secret:${secret}`);
  const totp = authenticator.generate(secret);
  console.log(`Testing totp:${totp}`);
  const token = await login(email, password, totp);
  console.log(`Testing token:${token}`);
  const message = faker.word.words(Math.random() * 10);
  console.log(`Testing message:${message}`);
  const rndInt = Math.floor(Math.random() * 100) + 50;
  const sentence = faker.word.words(rndInt);
  console.log(`Testing sentence:${sentence}`);
  const encrypted = await encrypt(sentence, token);
  console.log(`Testing encrypted:${encrypted}`);
  const decrypted = await decrypt(encrypted, token);
  console.log(`Testing decrypted:${decrypted}`);
}

async function signUp(name: string, email: string, password: string) {
  const ip = process.env["TESTING_IP"];
  console.log("signUp");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      role: "Student",
    }),
    redirect: "follow",
  };

  const response = await lt_fetch(
    "http://" + ip + ":4000/api/v1/signup",
    requestOptions
  ).catch((error) => console.log("error", error));
  console.log(response);
  if (response != undefined && response.status == 200) {
    const json = await response.json();
    return json.User;
  }
  return undefined;
}

async function login(email: string, password: string, totp: string) {
  const ip = process.env["TESTING_IP"];
  console.log("login");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      email: email,
      password: password,
      totp: totp,
    }),
    redirect: "follow",
  };

  const response = await lt_fetch(
    "http://" + ip + ":4000/api/v1/login",
    requestOptions
  ).catch((error) => console.log("error", error));
  console.log(response);
  if (response != undefined && response.status == 200) {
    const json = await response.json();
    return json.token;
  }
  return false;
}

async function encrypt(message: string, token: string) {
  const ip = process.env["TESTING_IP"];
  console.log("encrypt");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      message: message,
      token: token,
    }),
    redirect: "follow",
  };

  const response = await lt_fetch(
    "http://" + ip + ":4000/api/v1/encrypt",
    requestOptions
  ).catch((error) => console.log("error", error));
  console.log(response);
  if (response != undefined && response.status == 200) {
    const json = await response.json();
    return json.encrypted;
  }
  return false;
}

async function decrypt(encrypted: string, token: string) {
  const ip = process.env["TESTING_IP"];
  console.log("decrypt");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      encrypted: encrypted,
      token: token,
    }),
    redirect: "follow",
  };

  const response = await lt_fetch(
    "http://" + ip + ":4000/api/v1/decrypt",
    requestOptions
  ).catch((error) => console.log("error", error));
  console.log(response);
  if (response != undefined && response.status == 200) {
    const json = await response.json();
    return json.decrypted;
  }
  return false;
}
