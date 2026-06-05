# Military Countdown Bot

This repository keeps a tiny daily countdown commit while I am away.

The GitHub Actions workflow updates `countdown.md` once per day with a simple English message:

```text
X days until I return from military service.
```

## Setup

1. Create a new GitHub repository.
2. Push this folder to that repository.
3. Make sure the repository owner is your GitHub user account, not an organization.
4. In GitHub, go to `Settings -> Actions -> General -> Workflow permissions` and enable `Read and write permissions`.
5. Optionally run the workflow manually from the `Actions` tab once to test it.

The workflow is scheduled for `05:00` Turkey time every day.

