# lambda-image-converter

AWS API Gatewayと連携し、リクエストされた幅と拡張子に変換した画像を返すラムダ関数です。Nodeで動いています。webp変換にも対応しています。

AWS Lambda funcs that resize images into the size or even convert the extension given through the AWS API Gateway request. Uses Node. Can convert into webp as well.

## DEVELOPMENT
- nodenv
- node v10.15.3
- serverless framework

### 準備
```
$ brew install nodenv // you can nodenv by git as well.
$ nodenv install `cat .node-version`
$ npm install
$ serverless -v // or sls -v
```