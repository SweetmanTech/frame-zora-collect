/** @jsxImportSource frog/jsx */

import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { zoraTimedSaleStrategyABI } from "@zoralabs/protocol-deployments";
import { Address } from "viem";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  title: "Frog Frame",
});

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    action: "/finish",
    intents: [
      <Button.Transaction target="/mint">Mint</Button.Transaction>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.transaction("/mint", async (c) => {
  const { address } = c;
  const minter = "0x777777722D078c97c6ad07d9f36801e653E356Ae" as Address;
  const quantity = 1;
  // change this to your zora collection on base
  const collection = "0x7D9aD986e8369f7909A363798a0de4025D1E784d" as Address;
  // change this to your tokenId
  const tokenId = 11;
  // change this to your comment
  const comment = "ALEPH";
  const args = [
    address,
    quantity,
    collection,
    tokenId,
    address,
    comment,
  ] as any;
  const functionName = "mint";
  const value = parseEther("0.000111");
  return c.contract({
    abi: zoraTimedSaleStrategyABI,
    chainId: "eip155:8453",
    functionName,
    args,
    to: minter,
    value,
  });
});

app.frame("/finish", (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
