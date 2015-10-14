#!/bin/bash
wget ftp://cp01-super-rdtest0.cp01.baidu.com:/home/super/wuzonggang/stat_res/xpath/xpath_`date -d '6 days ago' +%Y%m%d` -O /home/wangxinyi/public_html/xpath/data/xpath_clk_`date -d '6 days ago' +%Y%m%d`
wget ftp://cp01-super-rdtest0.cp01.baidu.com:/home/super/wuzonggang/stat_res/xpath/card_`date -d '6 days ago' +%Y%m%d` -O /home/wangxinyi/public_html/xpath/data/card_pv_`date -d '6 days ago' +%Y%m%d`
php /home/wangxinyi/public_html/xpath/dataHandler.php

