import socket
import requests
import psutil
import platform
import getpass
import wmi
import uuid
import sys
import os
import json
import time
import subprocess
from datetime import datetime, timezone


def get_base_path():

    if getattr(sys, "frozen", False):

        return os.path.dirname(
            sys.executable
        )

    return os.path.dirname(
        os.path.abspath(__file__)
    )


def load_config():

    base_dir = get_base_path()

    config_path = os.path.join(
        base_dir,
        "config.json"
    )

    with open(
        config_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)

CONFIG = load_config()

ASSET_TAG = CONFIG["asset_tag"]

API_URL = (
    f'{CONFIG["server_url"]}agent/checkin'
)

# =========================
# MAC ADDRESS
# =========================

def get_mac():

    mac = uuid.getnode()

    return ":".join(

        [
            "{:02x}".format(
                (mac >> ele) & 0xff
            )

            for ele in range(
                40,
                -1,
                -8
            )

        ]

    ).upper()


# =========================
# WINDOWS VERSION
# =========================

def get_windows_name():

    c = wmi.WMI()

    return c.Win32_OperatingSystem()[0].Caption


# =========================
# CPU
# =========================

def get_cpu():

    try:

        c = wmi.WMI()

        return c.Win32_Processor()[0].Name

    except:

        return "Sin datos"


# =========================
# RAM
# =========================
def get_ram():

    ram = psutil.virtual_memory()

    total_gb = round(
        ram.total / (1024**3)
    )

    return (

        f"{total_gb} GB",

        ram.percent

    )


# =========================
# DISCOS
# =========================
def get_disks():

    try:

        disks = []

        partitions = psutil.disk_partitions()

        for partition in partitions:

            try:

                usage = psutil.disk_usage(
                    partition.mountpoint
                )

                total_gb = round(
                    usage.total / (1024 ** 3)
                )

                letter = partition.device.replace("\\", "")

                disks.append(
                    f"{letter} {total_gb} GB"
                )  

            except:

                pass

        return " | ".join(disks)

    except:

        return "Sin datos"


# =========================
# USO DE DISCO
# =========================
def get_disk_usage():

    try:

        partitions = psutil.disk_partitions()

        usages = []

        for partition in partitions:

            try:

                usage = psutil.disk_usage(
                    partition.mountpoint
                )

                letter = partition.device.replace("\\", "")
                usages.append(

                    f"{letter} {usage.percent}%"

                )

            except:

                pass

        return " | ".join(usages)

    except:

        return "Sin datos"

# =========================
# ALMACENAMIENTO LIBRE DISCOS
# =========================
def get_disk_free():

    try:

        partitions = psutil.disk_partitions()

        frees = []

        for partition in partitions:

            try:

                usage = psutil.disk_usage(
                    partition.mountpoint
                )

                free_gb = round(
                    usage.free / (1024 ** 3)
                )

                letter = partition.device.replace(
                    "\\",
                    ""
                )

                frees.append(
                    f"{letter} {free_gb} GB"
                )

            except:

                pass

        return " | ".join(frees)

    except:

        return "Sin datos"

# =========================
# IP ADDRESS
# =========================

def get_ip():

    interfaces = psutil.net_if_addrs()

    for name, addrs in interfaces.items():

        if "Wi-Fi" in name or "WLAN" in name:

            for addr in addrs:

                if addr.family == socket.AF_INET:

                    return addr.address

    return "Sin datos"


# =========================
# PAYLOAD
# =========================
def build_payload():

    ram_total, ram_usage = get_ram()

    return {

        "asset_tag": ASSET_TAG,

        "hostname": socket.gethostname(),

        "mac_address": get_mac(),

        "ip_address": get_ip(),

        "operating_system": get_windows_name(),

        "windows_version": platform.version(),

        "logged_user": getpass.getuser(),

        "cpu": get_cpu(),

        "ram": ram_total,

        "ram_usage": ram_usage,

        "disk_total": get_disks(),

        "disk_usage": get_disk_usage(),

        "disk_free": get_disk_free(),

        "uptime": get_uptime(),

        "antivirus_enabled": get_defender_status(),

        "firewall_enabled": get_firewall_status()

    }


# =========================
# SEND DATA
# =========================
def send_checkin():

    payload = build_payload()

    response = requests.post(

        API_URL,

        json=payload,

        timeout=10

    )

    print(

        f"[OK] Checkin enviado - "

        f"Status {response.status_code}"

    )

# =========================
# TIEMPO DE ACTIVIDAD
# =========================
def get_uptime():

    boot_time = datetime.fromtimestamp(
        psutil.boot_time()
    )

    uptime = datetime.now() - boot_time

    days = uptime.days

    hours = uptime.seconds // 3600

    return f"{days} días {hours} horas"


# =========================
# FIREWALL
# =========================
def get_firewall_status():

    try:

        result = subprocess.check_output(

            "netsh advfirewall show allprofiles",

            shell=True

        ).decode(

            errors="ignore"
        )

        return "ON" in result

    except:

        return False

# =========================
# WINDOWS DEFENDER
# =========================
def get_defender_status():

    try:

        c = wmi.WMI(

            namespace="root\\SecurityCenter2"

        )

        antivirus = c.AntiVirusProduct()

        return len(antivirus) > 0

    except:

        return False

    
# =========================
# MAIN
# =========================

if __name__ == "__main__":

    interval = CONFIG["checkin_interval"]

    while True:

        try:

            send_checkin()

        except Exception as e:

            print(
                f"Error enviando checkin: {e}"
            )

        time.sleep(interval)
