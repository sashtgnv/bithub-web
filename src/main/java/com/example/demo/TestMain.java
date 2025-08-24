package com.example.demo;

import com.example.demo.models.User;

public class TestMain {
    public static void main(String[] args) {
        User user = new User();
        user.setId(1L);
        System.out.println(user.getId());
    }
}
