---
title: node第三方库学习笔记（1）
date: 2018-04-04 17:34:01
tags:
---

每天学习五个node库，第一个 o(*^▽^*)┛
————————————————————

is sorted github链接： [https://github.com/dcousens/is-sorted](https://github.com/dcousens/is-sorted)

这个库提供了判断一个数组队列是否为制定条件排列的方法，方法默认有两个参数，一个是需要判断的数组，一个是自定义的判断函数

如果没有给定判断函数的参数，则调用库定义的默认函数，规则是从小到大排列

原理是遍历整个判断数组，将遍历到的数组项和队列里上一个数组项传入指定或者默认的比较函数，如果不符合判断条件，则返回false，遍历结束；否则遍历到最后一个数组项，则返回true
