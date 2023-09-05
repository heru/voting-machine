import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Hello } from "../target/types/hello";
import { use } from "chai";

describe("self facebook", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Hello as Program<Hello>;

  it("creating a facebook account", async () => {
    const ix = await program.methods.createFacebook("Deep", "always thinking", "@deep");
    const userFacebookAddress = (await ix.pubkeys()).facebookAccount;
    console.log("User Facebook address ::", userFacebookAddress);

    // create user facebook address
    const tx = await ix.rpc();
    console.log("transaction signature ::", tx);

    let userDetails = await program.account.facebookAccount.fetch(userFacebookAddress);
    console.log(`Created a new account with following details \n
       Name :: ${userDetails.name} \n 
       Status :: ${userDetails.status} \n 
       Twitter :: ${userDetails.twitter}`);
  });

  it("update facebook status", async () => {
    const ix = await program.methods.updateStatus("&mut self :crab");
    const userFacebookAddress = (await ix.pubkeys()).facebookAccount;
    console.log("userFacebook Address ::", userFacebookAddress);

    const tx = await ix.rpc();
    console.log("your transaction signature", tx);

    // check user details
    let userDetails = await program.account.facebookAccount.fetch(userFacebookAddress);

    console.log(`Update account's status with following details \n
       Name :: ${userDetails.name} \n 
       Status :: ${userDetails.status} \n 
       Twitter :: ${userDetails.twitter}`);
  });

  it("find someone's facebook", async () => {
    const userAddress = new anchor.web3.PublicKey("Gz2k7789kKnoeDo9TWXpCmSudp5DW22u8FvnRcFS5aS6");
    const [userFacebookAccount, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('self-custodial-facebook2'),
        userAddress.toBuffer(),
      ],
      program.programId
    )
    // check user
    try {
      let userDetails = await program.account.facebookAccount.fetch(userFacebookAccount);
      console.log(
        `Created a new account with following details \n Name :: ${userDetails.name} \n Status :: ${userDetails.status} \n Twitter :: ${userDetails.twitter}`
      )
    } catch (error) {
      console.log("Users account does not exist :: ", error)
    }
  });

  it("delete user account", async () => {
    const ix = await program.methods.deleteAccount()
    const userFacebookAddress = (await ix.pubkeys()).facebookAccount
    console.log("user facebook address :: ", userFacebookAddress.toString());
    // Create user's facebook address
    const tx = await ix.rpc()
    console.log("Your transaction signature", tx);
    // User Details Not found, 'cuz we closed the account
    try {
      let userDetails = await program.account.facebookAccount.fetch(userFacebookAddress);
      console.log(`Created a new account with following details \n Name :: ${userDetails.name} \n Status :: ${userDetails.status} \n Twitter :: ${userDetails.twitter}`)
    } catch {
      console.log("User Details Not found, 'cuz we close the account");
    }
  });
});