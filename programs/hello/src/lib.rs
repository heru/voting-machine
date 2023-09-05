use anchor_lang::prelude::*;

declare_id!("4foq4U1K5zSvsdurfqzqhTkAysiLVnnvg2Bwkdn8v1xy");

#[program]
pub mod hello {
    use super::*;

    pub fn init_vote_bank(ctx: Context<InitVote>) -> Result<()> {
        ctx.accounts.vote_account.is_open_to_vote = true;

        Ok(())
    }

    pub fn gib_vote(ctx: Context<GibVote>, vote_type: VoteType) -> Result<()> {
        match vote_type {
            VoteType::GM => {
                msg!("voted for GM 🤝");
                ctx.accounts.vote_account.gm += 1;
            },
            VoteType::GN => {
                msg!("voted for GN 🤞");
                ctx.accounts.vote_account.gn += 1;
            }
        };

        Ok(())
    }

    pub fn create_facebook(ctx: Context<InitFacebook>, name: String, status: String, twitter: String) -> Result<()> {
        // setting user data in user's acc
        let user_account_data = &mut ctx.accounts.facebook_account;
        user_account_data.bump = *ctx.bumps.get("facebook_account").unwrap();

        user_account_data.authority = *ctx.accounts.signer.key;
        user_account_data.name = name.to_owned();
        user_account_data.status = status.to_owned();
        user_account_data.twitter = twitter.to_owned();

        // show user account into message logs
        msg!("created a new account's with following detais
            Name: {}
            Status: {}
            Twitter: {}
        ", name, status, twitter);
        Ok(())
    }

    pub fn update_status(ctx: Context<UpdateStatus>, new_status: String) -> Result<()> {
        msg!("Update status from :: {} to :: {}", &ctx.accounts.facebook_account.status, &new_status);
        ctx.accounts.facebook_account.status = new_status;
        Ok(())
    }

    pub fn delete_account(_ctx: Context<CloseAccount>) -> Result<()> {
        msg!("account's closed successfully");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitVote<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 1 + 8 + 8,
    )]
    pub vote_account: Account<'info, VoteBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct VoteBank {
    is_open_to_vote: bool,
    gm: u64,
    gn: u64,
}

#[derive(Accounts)]
pub struct GibVote<'info> {
    #[account(mut)]
    pub vote_account: Account<'info, VoteBank>,
    pub signer: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum VoteType {
    GM,
    GN
}

#[account]
pub struct FacebookAccount {
    pub authority: Pubkey,
    pub bump: u8,
    pub name: String,
    pub status: String,
    pub twitter: String,
}

impl FacebookAccount {
    const LEN: usize = 
        8 +
        32 +
        1 + 
        (4 + 10) +
        (4 + 100) +
        (4 + 10);
}

#[derive(Accounts)]
pub struct InitFacebook<'info> {
    // users' account
    #[account(mut)]
    pub signer: Signer<'info>,
    // create new account for every user with seed of their
    // wallet address. 
    // this constraint allow one-account per wallet address.
    #[account(
        init,
        payer = signer,
        space = FacebookAccount::LEN,
        seeds = [
            "self-custodial-facebook".as_bytes(),
            signer.key().as_ref()
        ],
        bump
    )]
    pub facebook_account: Account<'info, FacebookAccount>,
    pub system_program: Program<'info, System>, 
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    // user facebook accounts's
    #[account(
        mut,
        seeds = ["self-custodial-facebook".as_bytes(), signer.key().as_ref()], 
        bump = facebook_account.bump,
    )]
    pub facebook_account: Account<'info, FacebookAccount>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = ["self-custodial-facebook".as_bytes(), signer.key().as_ref()], 
        bump = facebook_account.bump,
        close = signer
    )]
    pub facebook_account: Account<'info, FacebookAccount>,
}