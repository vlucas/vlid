npm run build
doctoc README.md --title '**Table of Contents**'
git add dist/ *.md
git commit -am "JS dist build files + docs"
git push
