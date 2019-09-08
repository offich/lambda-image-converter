# lambda-image-converter

AWS API Gatewayと連携し、リクエストされた幅と拡張子に変換した画像を返すラムダ関数です。Nodeで動いています。webp変換にも対応しています。

AWS Lambda funcs that resize images into the size or even convert the extension given through the AWS API Gateway request. Uses Node. Can convert into webp as well.

## DEVELOPMENT
- nodenv
- node v10.15.3
- serverless framework

### INSTALL
```
$ brew install nodenv // you can nodenv by git as well.
$ nodenv install `cat .node-version`
$ npm install
$ serverless -v // or sls -v
```

### CAUTION
画像のリサイズや拡張子変換にsharpパッケージを使用しています。
ラムダで動かすときは、sharpパッケージを下のオプション付きでインストールしてください。
参照: https://sharp.pixelplumbing.com/en/stable/install/#aws-lambda

Sharp package takes a role in resizing and converting images in this respository.
Be aware that you have to install sharp package with the options below.
See: https://sharp.pixelplumbing.com/en/stable/install/#aws-lambda

```
rm -rf node_modules/sharp
npm install --arch=x64 --platform=linux --target=10.15.0 sharp
```