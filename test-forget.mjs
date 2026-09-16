import { authClient } from "./lib/auth-client.js";

async function test() {
  try {
    const res = await authClient.forgetPassword({ email: "test@test.com" });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
