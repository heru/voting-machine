import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Hello } from "../target/types/hello";

describe("hello", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Hello as Program<Hello>;
  let voteBank = anchor.web3.Keypair.generate();

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

  it("create vote bank for public to vote", async () => {
    const tx = await program.methods.initVoteBank()
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .signers([voteBank])
      .rpc();
    console.log("TxHash ::", tx);
  });

  it("Vote for GM", async () => {
    const tx = await program.methods.gibVote({ gm: {} })
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .rpc();

    console.log("TxHash ::", tx);

    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GM :: ${voteBankData.gm}`);
    console.log(`Total GN :: ${voteBankData.gn}`);
  });

  it("Vote for GN", async () => {
    const tx = await program.methods.gibVote({ gn: {} })
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .rpc();
    console.log("TxHash ::", tx);


    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GMs :: ${voteBankData.gm}`)
    console.log(`Total GNs :: ${voteBankData.gn}`)
  });

  it("Vote for GN", async () => {
    const tx = await program.methods.gibVote({ gn: {} })
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .rpc();
    console.log("TxHash ::", tx);


    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GMs :: ${voteBankData.gm}`)
    console.log(`Total GNs :: ${voteBankData.gn}`)
  });
  it("Vote for GN", async () => {
    const tx = await program.methods.gibVote({ gn: {} })
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .rpc();
    console.log("TxHash ::", tx);


    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GMs :: ${voteBankData.gm}`)
    console.log(`Total GNs :: ${voteBankData.gn}`)
  });

});
