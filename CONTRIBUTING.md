# HomeUniteUs Contributing Guide

To begin working on the `HomeUniteUs` project you will need to be an active member of Hack for LA. If you have not completed the onboarding process, then please refer to the [Getting Started Page](https://www.hackforla.org/getting-started) for full instructions. This onboarding will provide you access to the Hack for LA Slack, GitHub, and Google Drive.

Welcome to Hack for LA, and thank you for contributing 🥳🥳!!

## First Steps

Once you've completed onboarding and been assigned a role on the team, you can begin reviewing our internal documentation and open tasks.

1. Join the [#home-unite-us slack channel](https://hackforla.slack.com/archives/CRWUG7X0C).
2. Request access to, and review the documents in, the [home-unite-us shared drive](https://drive.google.com/drive/u/0/folders/1ahxiD9rIsBtx0yAPlPcPaGw8zGrfHHm9).
3. Visit our [project boards](https://github.com/hackforla/HomeUniteUs/projects) and see issues in the prioritized backlog.

## Code of Conduct

We are passionate about the Hack for LA [Code of Conduct](https://github.com/hackforla/codeofconduct). Please help us uphold these policies so that we can continue to maintain an open, safe, and inclusive culture. It is everyone's responsibility to maintain these policies, so please report any violations to the [Hack for LA team](https://github.com/hackforla/codeofconduct#email-template-for-anti-harassment-reporting).

## Issues

### Create a new issue

Before creating a new issue, search through the [current list of issues](https://github.com/hackforla/HomeUniteUs/issues) to determine if the issue has been identified. If it is already present, then feel free to comment on the existing issue to confirm the problem and add any additional information.

To create a new issue, please use the [blank issue template](/.github/ISSUE_TEMPLATE/blank-issue.md) (available when you click New Issue). Issues with more information and fuller descriptions are more likely get addressed, so please include as much information as possible.

If you want to create an issue for other projects to use, please create the issue in your own repository and send a slack message to one of your hack night hosts with the link.

### Finding an issue to solve

All issues can be found on our [project board](https://github.com/hackforla/HomeUniteUs/projects/3). The `Prioritized Backlog` column contains features that are ready to work, and considered a high priority. Each item will list the current assignees. If the role you are interested in is unfilled, then you can assign the issue to yourself and add a comment to the issue stating your intention to work the issue.

### Start a fix

The HomeUniteUs repository gladly accepts pull requests from onboarded members. The onboarding process should grant you with write access to the repository, so creating a fork is not necessary.

Once you find an issue you want to work on, you need to self-assign to claim it and then update the [project board](https://github.com/hackforla/HomeUniteUs/projects/3) to move the issue from the `Prioritized Backlog` to the `In progress` column.

```shell
# Create a copy of the repo on your local machine
git clone https://github.com/hackforla/HomeUniteUs.git
# Go to your new local clone
cd HomeUniteUs
# Verify your clone is pointing to the correct origin URL
# fetch and push should be https://github.com/{Your-GitHub-Handle}/HomeUniteUs.git
git remote -v
# Set the HomeUniteUs main repo as the upstream repo
# This will allow us to synchronize the fork with the main repo
git remote add upstream https://github.com/hackforla/HomeUniteUs.git
# Create a branch and start working!
git checkout -b my-new-awesome-branch
```

### Submit a fix

Once you are satisfied with your changes, push them to the feature branch you made within your remote forked repository.

`git push --set-upstream origin my-new-awesome-branch`

From here, you can use the GitHub UI to create and submit a Pull Request. Navigate to the branch on your fork repo, and click `New pull request`. The base repository should be set to the `hackforla/HomeUniteUs` repo by default. Add a detailed description of your change, submit your PR, and wait back for comments. Additional changes may be required before merging - don't worry, this is a normal part of the merging process!
