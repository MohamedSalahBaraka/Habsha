import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "الرئيسية",
          title: "الرئيسية",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DelivareyFormerOrders" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "طلبات التوصيل السابقة",
          title: "طلبات التوصيل السابقة",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="FoodFormerOrders" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "طلبات المطاعم السابقة",
          title: "طلبات المطاعم السابقة",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Landing" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "اطلب طعامك",
          title: "اطلب طعامك",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="LandingStore" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "المتجر",
          title: "المتجر",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="OrderDelivarey" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "طلب توصيل جديد",
          title: "طلب توصيل جديد",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="OrderDelivaryForBisnesses" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "طلب توصيل للأعمال",
          title: "طلب توصيل للأعمال",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Setting" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "الاعدادات",
          title: "الاعدادات",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="StoreFormerOrders" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "طلبات المتجر السابقة",
          title: "طلبات المتجر السابقة",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
