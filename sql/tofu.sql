drop database tofu;

create database tofu;

use tofu;

create table user(
	id int auto_increment primary key,
    name char(16) not null,
    account char(30) not null unique,
    password char(16) not null,
    gender tinyint not null,
    email char(30),
    phone char(11),
    description char(140),
    headimg char(100) not null,
    timestamp bigint not null,
    freeze tinyint not null
);

create table bill(
	id int auto_increment primary key,
    ownerid int not null,
    note text not null,
    timestamp bigint not null,
    price float not null,
    category char(16),
    sort char(16),
    project char(16),
    role char(16),
    payway char(16),
    foreign key (ownerid) references user(id)
);

create table config(
	ownerid int auto_increment primary key,
	content text not null,
    foreign key (ownerid) references user(id)
);



insert into user(name,account,password,gender,headimg,timestamp,freeze) 
	values('Hanggeen','592499197@qq.com','tofu0723',0,'imgurl',1493542211611,0);

insert into bill(ownerid, note, timestamp, price, category, sort, payway)
	values(1, '粟米饼/萝卜糕/鸡蛋', 1493542211611, 5.5, '饮食', '午餐', '大学城一卡通');

insert into config(ownerid, content)
	values(1, '{"category":{"交通":["地铁","公交","共享单车","滴滴","的士"],"饮食":["早餐","午餐","下午茶","晚餐","夜宵","零食"],"服饰":["上衣","下衣","鞋子","配饰"]},"project":[],"role":[],"payway":["现金","微信支付","支付宝","大学城一卡通","银行卡"]}');


insert into config(ownerid, content) values(?, ?);


select name from user where account = '592499197@qq.com' and password = 'tofu0723';

select * from bill where ownerid = 1;

select * from config where ownerid = 1;

update bill set note = '萝卜糕、粟米饼、鸡蛋', price = 6.0 where id = 1;