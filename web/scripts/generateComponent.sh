# Creates a component directory given the name as an argument. 
# cmd -> generateComponent.sh TestComponent 
# alias this command in your .zshrc
COMPONENT_NAME=$1
COMPONENT_DIR=${PWD}/$COMPONENT_NAME

mkdir $COMPONENT_DIR
cd $COMPONENT_DIR

echo "import $COMPONENT_NAME from './$COMPONENT_NAME';\nexport default $COMPONENT_NAME;" > index.js
echo "import React from 'react';\nimport styles from './$COMPONENT_NAME.module.css';\n\nfunction $COMPONENT_NAME() {}\n\nexport default $COMPONENT_NAME;" > $COMPONENT_NAME.jsx
> $COMPONENT_NAME.module.css