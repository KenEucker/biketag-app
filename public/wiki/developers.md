## Developers, Developers, Developers

Developers can get involved in the BikeTag project by forking any of the Open-Source BikeTag repositories and sending Pull Requests to origin repositories for updates. Look for the "help-wanted" or "good-first-issue" tags or head to the discussions of the project to see where you can contribute.

The BikeTag Project welcomes anyone and everyone to get involved and make this thing better and better. It is the expectation of the BikeTag Project and BikeTag community members that everyone, developers included, follow the BikeTag Code of Conduct which can be found in each of the BikeTag repositories.

You should be able to clone this code and get it up and running for a read-only version of the BikeTag game on your machine. See the README for more details.

## GitFlow

For the new Netilfy platform based server(less) infrastructure, we will have the following breakdown of environments:

**Production**
branch: `production`
site: https://biketag.org
API: https://api.biketag.org

**Staging**
branch: `staging`
site: https://biketag.io
API: https://api.biketag.io

**Development**
branch: `develop`
site: https://biketag.net
API: https://api.biketag.net

**Local**
branch: [`feature/your-feature-branch`]
site: http://locahost:8080
API: http://localhost:7200

This will accommodate a CI integration with both GitHub actions as well as Netlify integrated deploys. Contributors will follow the development path of the prescribed GitFlow:

### 1. Fork it _(to your git repo)_

### 2. Branch it _(for your feature/fix)_

### 3. Pull it _(pull the target branch back into your branch before committing)_

### 4. Commit it _(your branch to your repo)_

### 5. Push it _(to your git repo)_

### 6. PRR it _(your git repo target branch to origin repo `develop`)\*_

### 7. PR oF fit _(continue that process as necessary feedback is addressed)+_

### 8. MoRR _(PR's to develop branch are deployed to biketag.net)\*_

### 9. Merge it _(develop branch is deployed to biketag.io after merged PR)_

### 10. Watch it _(develop branch is merged into production and then deployed to biketag.org)_

(\* = additional review phase)
(+ = final fix phase)
