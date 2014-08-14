# Contributing

## General Workflow

1. Fork the repo
2. Clone down to local
3. Create an upstream remote to faceoff master and pull from this often:<br>
```git remote add upstream https://github.com/Face-Off/doingfine.git```
4. Make commits to your local master branch
5. Pull from upstream master and resolve conflicts before pushing to your fork origin on github
6. Push to your fork master
7. Create Pull request to faceoff master
8. Project admins will review pull requests and merge or leave comments for resubmitting.

## Details 

### Fork the repo

Use github’s interface to make a fork of the project repo. Clone your forked repo to your local computer:
```
git clone https://github.com/<USER_NAME>/doingfine.git
```

Once complete navigate into the cloned folder and add the project repo as an upstream remote:
```
cd faceoff
git remote add upstream https://github.com/Face-Off/doingfine.git
```

### Deploying the Server on Heroku
If you are a project admin, follow these steps to deploy the server on heroku.

1. Install the heroku CLI if you do not have it installed and log-in to your account. Here's a guide: https://devcenter.heroku.com/articles/heroku-command
2. Add heroku as a remote repo:<br>
```git remote add heroku git@heroku.com:tradingfaces.git```
3. Push to the heroku remote repo once all testing has been completed and app is production ready:<br>
```git push heroku master```



<!-- Links -->
[style guide]: https://github.com/hackreactor-labs/style-guide
[n-queens]: https://github.com/hackreactor-labs/n-queens
[Underbar]: https://github.com/hackreactor-labs/underbar
[curriculum workflow diagram]: http://i.imgur.com/p0e4tQK.png
[cons of merge]: https://f.cloud.github.com/assets/1577682/1458274/1391ac28-435e-11e3-88b6-69c85029c978.png
[Bookstrap]: https://github.com/hackreactor/bookstrap
[Taser]: https://github.com/hackreactor/bookstrap
[tools workflow diagram]: http://i.imgur.com/kzlrDj7.png
[Git Flow]: http://nvie.com/posts/a-successful-git-branching-model/
[GitHub Flow]: http://scottchacon.com/2011/08/31/github-flow.html
[Squash]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
