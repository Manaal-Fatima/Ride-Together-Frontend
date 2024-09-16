package com.iqraaslam.StickerSmash

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.soloader.SoLoader
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage // <-- Import this

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages: List<ReactPackage> = PackageList(this).packages
            packages.add(ReactNativePushNotificationPackage()) // <-- Add this line
            return packages
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
        ReactNativePushNotificationPackage().createChannels(this)  // <-- Initialize the push notification channels
    }
}
