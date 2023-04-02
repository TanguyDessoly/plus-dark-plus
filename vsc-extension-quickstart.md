# Welcome to your VS Code Extension

## What's in the folder

* This folder contains all of the files necessary for your color theme extension.
* `package.json` - this is the manifest file that defines the location of the theme file and specifies the base theme of the theme.
* `themes/+Dark+-color-theme.json` - the color theme definition file.

## Get up and running straight away

* Press `F5` to open a new window with your extension loaded.
* Open `File > Preferences > Color Themes` and pick your color theme.
* Open a file that has a language associated. The languages' configured grammar will tokenize the text and assign 'scopes' to the tokens. To examine these scopes, invoke the `Developer: Inspect Editor Tokens and Scopes` command from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).

## Make changes

* Changes to the theme file are automatically applied to the Extension Development Host window.

## Adopt your theme to Visual Studio Code

* The token colorization is done based on standard TextMate themes. Colors are matched against one or more scopes.

To learn more about scopes and how they're used, check out the [color theme](https://code.visualstudio.com/api/extension-guides/color-theme) documentation.

## Install your extension

* To start using your extension with Visual Studio Code copy it into the `<user home>/.vscode/extensions` folder and restart Code.
* To share your extension with the world, read on https://code.visualstudio.com/docs about publishing an extension.


## Publish to a Marketplace

npm install vsce -g

Create a git repository (to avoid issues, use GitHub) for your project and connect it. Push your whole theme and open up the package.json file.

Inside you will need to configure the git repository, icon, author and all of the marketplace data, which should end up looking something like this:

Now it’s time to package and publish the theme using vsce:

Head over to Azure DevOps and create your organization under which you will publish your extensions https://dev.azure.com/

Once you’ve done that, you’ll need to create your own Personal Access Token (PAT) for that organization.

However, you will want to be careful with this otherwise you will end up getting a 401 error. (vsce 401 error)

When you are creating your PAT you MUST select “All Accessible Organizations”!

Otherwise you will end up receiving the dreaded “Error: Failed Request: Unauthorized(401)”

There is just one more annoying thing you have to do and you will be ready to publish! You will need to create a Publisher.

I prefer to do this directly by using the following link https://marketplace.visualstudio.com/manage/createpublisher, however you can also run the following command and create it that way:

vsce create-publisher (publisher name)

I recommend that you use the link and avoid the vsce shortcut for this, but it is completely up to you.

Inside the Terminal, login to your publisher:

vsce login (publisher name)

Package the theme you created:

vsce package

and publish!

vsce publish