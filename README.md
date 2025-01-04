# LIPS

# Ví dụ file upload:

LIID, LEA
~!!@!#$11123332131312312321321321312321111111111111111111111111111111111111111131241414,aa
~!!@!#$11123332131312312321321321312321111111111111111111111111111111111111111131241414,aa
,,,,,,
34234234234
a,1
a,12
a,13

# 1

Dòng 2, 3 có nhiều lõi cùng 1 lúc thì ghi log lỗi như thế nào: cùng vượt quá max length, chứa kí tự ko hợp lệ, trùng bản ghi
-> Ghi ra file lỗi tất cả các lỗi hay chỉ ghi 1 lỗi (nếu ghi 1 thì ưu tiên lỗi nào)

# 2

Dòng 4, 5 nhập sai template [LIID,LEA] -> log lỗi trường hợp này như thế nào

# 3

Trường hợp 1 trường trùng nhiều bản ghi với các dòng khác thì ghi lỗi như thế nào
-> Option1:

7,LIID,Trùng bản ghi dòng 6
8,LIID,Trùng bản ghi dòng 6

-> Option 2:

7,LIID,Trùng bản ghi dòng 6
8,LIID,Trùng bản ghi dòng 6, 7

# Ví dụ upload file chỉ có header mà ko content thì hiển thị lỗi như thế nào?

LIID,LEA

# Design file tepmate chỉ có định dạng csv -> SRS define 2 định dạng là txt và csv -> tải về csv / cả hai?

## Run tasks

To run tasks with Nx use:

```sh
npx nx run-many --target=serve --parallel --maxParallel=5
```

## Install @nx/angular

```sh
npm install -D @nx/angular
```

## Init angular to NX workspace (If the configuration for supporting Angular is not set up yet.)

```sh
npx nx generate @nx/angular:init --keepExistingVersion --updatePackageScripts
```

## Add new @nx/angular:host

```sh
npx nx generate @nx/angular:host apps/angular-monorepo --prefix=app --e2eTestRunner=none
```

## Add new @nx/angular:remote (LEA)

```sh
npx nx generate @nx/angular:remote apps/lea --host=angular-monorepo --prefix=app --e2eTestRunner=none
```

## Add new @nx/angular:remote (LEMF)

```sh
npx nx generate @nx/angular:remote apps/lemf --host=angular-monorepo --prefix=app --e2eTestRunner=none
```
