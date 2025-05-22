# The Easy SSH Key Setup Guide That should be normalized
**"The 2025 SSH Key Setup That Doesn't Suck"**

```bash
# Step 1 – Create your key
ssh-keygen -t ed25519 -C "username_master_2025"

# Step 2 – Upload public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Paste this at github.com > Settings > SSH Keys

# Step 3 – On any server, run this
ssh-import-id-gh usernamedev
```

That's it.
No `scp`, no editing `.ssh/authorized_keys`, no broken muscle memory.

