---
title: "GIT"
subtitle: "My notes on the version control system"
date: "09/22/2022"
type: "seedling"
---

What is Git?

From its website, https://git-scm.com, 
"Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency."

Git is the most popular version control system. A VCS records changes made to our code over time in a special database called repository. Thus, it is possible to look at a project's history and see who made what changes, and why. It is easily possible to revert our code to a different point in time. 

It is also possible to work with another person(s) and add changes to a centralized or distributed repository. 

In centralized systems, all team members connect to a central server to get the latest copy of a code and to share the changes with others. The potential problem is that in case the server goes offline for whatever reason, we would be prived of continuing to share our mutual work, so we'd have to wait until the server goes online again. 

In distribuited systems, every member of the project has a copy with its history in every machine, so we can save snapshots locally. If the server is offline, we can sync the project directly with others. (GIT, Mercurial)

Git is free, open source, fast and scalable. This makes GIT incredibly powerful and popular for all people worldwide. 



In repositories → we'll find overall changes of a project, including a timeline of the entire project

Local repositories

directories → repos in their current state in time. 

We can Push and pull from Github! 


## Git important commands
git init intiliazes a repo

git add . agrega todo al staging

git commit -m “comment”

git checkout ID (ir a un commit viejo)

git checkout master (volver al ahora)

git log (ver los commits)

git revert ID (para volver) [se puede hacer hacer revert de un revert, porque un REVERT es un nuevo commit]

git reset —hard ID (hard reset para volver a un commit y quedarse ahi)

git log —oneline (log en 1 sola linea por commit)

touch .gitignore (crear gitignore)

gitignore→

con # Se pueden hacer comentarios

Autogen/*  significa que va a ignorar todos los files dentro de la carpeta autogen 

git rm -f removes the file from the working directory

## Branches

siempre hacer un comit inicial antes de crear un branch

git checkout -b dev(cambia y crea la branch dev)

git checkout master (volvemos a la branch inicial/master)

git branch bugs (crea nueva branch llamada bugs)

list branches → git branch -a (a es por ALL)

delete a branch → git branch -d bugs 

MERGE

Pararse sobre el branch master (o el branch al que se mergeará el otro branch)

git merge dev
