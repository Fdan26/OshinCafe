package com.oshin.cafe.demo;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Intent target;
    if ("customer".equals(BuildConfig.APP_MODE)) {
      target = new Intent(this, CustomerActivity.class);
    } else {
      target = new Intent(this, CafeActivity.class);
    }

    target.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    startActivity(target);
    finish();
  }
}
