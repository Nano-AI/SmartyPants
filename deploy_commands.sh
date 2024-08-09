npm run build
git add .
git commit -m "updated frontend"
git push origin master
git subtree push --prefix frontend/dist origin gh-pages

