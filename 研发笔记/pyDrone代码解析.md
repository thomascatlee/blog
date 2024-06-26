---
title: pyDrone代码解析
date: 2024-06-18 14:56:59 +0800
author: wildcat
tags:
  - Micropython
  - Drone
  - ESP32
---


mpconfigport.h中定义了Micropython能调用的module，espdrone的定义就在其中。

```
#if MICROPY_ENABLE_ESP_DRONE
#define ESP_DRONE_MODULE              { MP_ROM_QSTR(MP_QSTR_drone), MP_ROM_PTR(&espdrone_module) },
#else
#define ESP_DRONE_MODULE
#endif

#define MICROPY_PORT_BUILTIN_MODULES \
    { MP_OBJ_NEW_QSTR(MP_QSTR_esp), (mp_obj_t)&esp_module }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_esp32), (mp_obj_t)&esp32_module }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_utime), (mp_obj_t)&utime_module }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_uos), (mp_obj_t)&uos_module }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_usocket), (mp_obj_t)&mp_module_usocket }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_machine), (mp_obj_t)&mp_module_machine }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR_network), (mp_obj_t)&mp_module_network }, \
    { MP_OBJ_NEW_QSTR(MP_QSTR__onewire), (mp_obj_t)&mp_module_onewire }, \
	ESP_DRONE_MODULE \
```
其具体的实现在mod_espdrone.c

```
#if MICROPY_ENABLE_ESP_DRONE

STATIC const mp_rom_map_elem_t espdrone_module_globals_table[] = {
	{ MP_ROM_QSTR(MP_QSTR___name__), MP_ROM_QSTR(MP_QSTR_espdrone) },
	{ MP_ROM_QSTR(MP_QSTR_DRONE), MP_ROM_PTR(&drone_drone_type) },
};

STATIC MP_DEFINE_CONST_DICT(espdrone_module_globals, espdrone_module_globals_table);

const mp_obj_module_t espdrone_module = {
    .base = { &mp_type_module },
    .globals = (mp_obj_dict_t *)&espdrone_module_globals,
};

/*******************************************************************************/

#endif 
```

继续分析，drone_drone_type的实现在mod_drone.c

```
STATIC const mp_rom_map_elem_t drone_locals_dict_table[] = {
	{ MP_ROM_QSTR(MP_QSTR__name__), MP_ROM_QSTR(MP_QSTR_DRONE) },
	//{ MP_ROM_QSTR(MP_QSTR_deinit), MP_ROM_PTR(&drone_deinit_obj) },
	{ MP_ROM_QSTR(MP_QSTR_stop), MP_ROM_PTR(&drone_stop_obj) },
	{ MP_ROM_QSTR(MP_QSTR_landing), MP_ROM_PTR(&drone_landing_obj) },
	{ MP_ROM_QSTR(MP_QSTR_take_off), MP_ROM_PTR(&drone_take_off_obj) },
	{ MP_ROM_QSTR(MP_QSTR_control), MP_ROM_PTR(&drone_control_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_states), MP_ROM_PTR(&read_states_obj) },
	{ MP_ROM_QSTR(MP_QSTR_trim), MP_ROM_PTR(&drone_trim_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_accelerometer), MP_ROM_PTR(&read_accelerometer_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_compass), MP_ROM_PTR(&read_compass_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_air_pressure), MP_ROM_PTR(&read_air_pressure_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_calibrated), MP_ROM_PTR(&read_calibrated_obj) },
	{ MP_ROM_QSTR(MP_QSTR_read_cal_data), MP_ROM_PTR(&read_cal_data_obj) },

};
STATIC MP_DEFINE_CONST_DICT(drone_drone_locals_dict,drone_locals_dict_table);

const mp_obj_type_t drone_drone_type = {
    { &mp_type_type },
    .name = MP_QSTR_drone,
    .make_new = drone_make_new,
    .locals_dict = (mp_obj_dict_t *)&drone_drone_locals_dict,
};
```
DRONE所支持的操作也都在此。

由此可以看到，Micropython和pyDrone硬件交互，主要在py-drone目录下的`mod_drone.c`中，`mod_wifilink.c`没有用到。