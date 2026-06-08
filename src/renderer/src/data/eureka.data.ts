import type { EurekaAreaId, Fate, LogosCrystal, Variant, WeatherRate } from '@renderer/types/eureka.type'

export const eurekaAreaNames: Record<EurekaAreaId, string> = {
  'area.EurekaAnemos': '常风之地',
  'area.EurekaPagos': '恒冰之地',
  'area.EurekaPyros': '涌火之地',
  'area.EurekaHydatos': '丰水之地',
}

export const eurekaAreaVariants: Record<EurekaAreaId, Variant[]> = {
  'area.EurekaAnemos': [],
  'area.EurekaPagos': [
    // 等级 20
    { level: '20', name: '野树灵', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '20', name: '恒冰深瞳', type: 'mutation', element: ['lightning', 'ice'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 21
    { level: '21', name: '瓦尔婴猴', type: 'mutation', element: ['lightning', 'earth'], timePeriod: 'sun', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '21', name: '北境浮蝶', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 22
    { level: '22', name: '雪地蛞蝓', type: 'adaptation', element: ['water'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '22', name: '瓦尔祸蛛蝎', type: 'mutation', element: ['lightning', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 23
    { level: '23', name: '瓦尔鼹鼠', type: 'mutation', element: ['earth', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '23', name: '僵尸布罗宾雅克', type: 'adaptation', element: ['earth'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 24
    { level: '24', name: '雪地海月水母', type: 'adaptation', element: ['water'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '24 + 1', name: '恒冰白狼', type: 'mutation', element: ['ice', 'fire'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 25
    { level: '25', name: '恒冰跳蜥', type: 'mutation', element: ['fire', 'lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },
    { level: '25', name: '珍卷恶魔', type: 'adaptation', element: ['wind'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '25', name: '雷暴元精', type: 'mutation', element: ['lightning', 'earth'], timePeriod: 'sun-moon', weather: ['thunder'] },

    // 等级 26
    { level: '26', name: '瓦尔螳螂', type: 'adaptation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '26', name: '北境蜂鸟', type: 'mutation', element: ['wind', 'fire'], timePeriod: 'sun', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '26', name: '融雪元精', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['fog'] },

    // 等级 27
    { level: '27', name: '恒冰巨熊', type: 'mutation', element: ['earth', 'ice'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },
    { level: '27', name: '冰霜明胶怪', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '27', name: '余烬元精', type: 'mutation', element: ['fire', 'water'], timePeriod: 'sun-moon', weather: ['heatWaves'] },

    // 等级 28
    { level: '28', name: '珊瑚乌菊石', type: 'mutation', element: ['water', 'lightning'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '28', name: '优雷卡风巨魔', type: 'mutation', element: ['ice', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '28', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },

    // 等级 29
    { level: '29 + 1', name: '余光闪烁玛塔蛇颈龟', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '29', name: '虚无双足飞龙', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '29', name: '恒冰牛羚', type: 'mutation', element: ['lightning', 'earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 30
    { level: '30', name: '恒冰巨鳄', type: 'mutation', element: ['earth', 'lightning'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '30', name: '寒冰镜骑士', type: 'mutation', element: ['wind', 'earth'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '30', name: '死魂', type: 'adaptation', element: ['lightning'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 31
    { level: '31 + 1', name: '凋零山克芹尼', type: 'mutation', element: ['wind', 'water'], timePeriod: 'sun-moon', weather: ['fog'] },
    { level: '31', name: '瓦尔守护者', type: 'mutation', element: ['earth', 'lightning'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '31', name: '余烬元精', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },

    // 等级 32
    { level: '32', name: '迪戈泰塔斯', type: 'mutation', element: ['earth'], timePeriod: 'sun', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '32', name: '恒冰骏雕', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '32', name: '雪暴元精', type: 'mutation', element: ['ice', 'earth'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },

    // 等级 33
    { level: '33', name: '恒冰半人马', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '33', name: '瓦尔守卫', type: 'adaptation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '33', name: '雷暴元精', type: 'mutation', element: ['lightning', 'earth'], timePeriod: 'sun-moon', weather: ['thunder'] },

    // 等级 34
    { level: '34', name: '乌洛里石守卫', type: 'mutation', element: ['earth', 'ice'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },
    { level: '34', name: '冰霜龙鸟', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'sun', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '34', name: '鬼灵', type: 'adaptation', element: ['water'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 35
    { level: '35', name: '山谷曼提克', type: 'mutation', element: ['fire', 'wind'], timePeriod: 'sun', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '35', name: '瓦尔尸生花', type: 'mutation', element: ['ice', 'water'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '35', name: '余烬元精', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },

    // 等级 36
    { level: '36', name: '暴雪古菩猩猩', type: 'mutation', element: ['ice', 'water'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '36', name: '尘世巨蟒', type: 'mutation', element: ['fire', 'ice'], timePeriod: 'sun-moon', weather: ['fog', 'heatWaves'] },
    { level: '36', name: '瓦尔腐尸', type: 'adaptation', element: ['ice'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },

    // 等级 37
    { level: '37 + 1', name: '虚无希里科塔', type: 'mutation', element: ['earth', 'ice'], timePeriod: 'sun-moon', weather: ['blizzards'] },
    { level: '37', name: '风暴鳐', type: 'mutation', element: ['water', 'wind'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '37', name: '雷暴元精', type: 'adaptation', element: ['lightning', 'earth'], timePeriod: 'sun-moon', weather: ['thunder'] },

    // 等级 38
    { level: '38', name: '瓦尔尤弥尔', type: 'mutation', element: ['lightning', 'fire'], timePeriod: 'sun', weather: ['fog'] },
    { level: '38', name: '恒冰阿努比斯', type: 'mutation', element: ['water', 'earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '38', name: '融雪元精', type: 'adaptation', element: ['water'], timePeriod: 'sun-moon', weather: ['fog'] },

    // 等级 39
    { level: '39', name: '大安菲瑟龙', type: 'mutation', element: ['fire', 'lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },
    { level: '39', name: '脱逃暴龙', type: 'mutation', element: ['earth', 'water'], timePeriod: 'moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '39', name: '余烬元精', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },

    // 等级 40
    { level: '40', name: '瓦尔狮鹫', type: 'mutation', element: ['wind', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '40', name: '恒冰奇美拉', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'sun-moon', weather: ['blizzards'] },
    { level: '40', name: '虚无冰雪龙', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'fog', 'heatWaves', 'thunder', 'snow', 'blizzards'] },
    { level: '40', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },
  ],
  'area.EurekaPyros': [
    // 等级35
    { level: '35', name: '搏斗魔石精', type: 'mutation', element: ['ice', 'lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },
    { level: '35', name: '徒步花苗', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级36
    { level: '36', name: '北境狮鹫', type: 'mutation', element: ['wind', 'ice'], timePeriod: 'sun', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '36', name: '瓦尔寒冰陷阱草', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级37
    { level: '37', name: '长臂猿', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '37', name: '涌火蛞蝓', type: 'mutation', element: ['earth', 'wind'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级38
    { level: '38', name: '守护者', type: 'adaptation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '38', name: '食叶虫', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'sun-moon', weather: ['fairSkies'] },

    // 等级39
    { level: '39', name: '涌火格雷姆林', type: 'mutation', element: ['ice', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '39', name: '虚无巨蝇', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级40
    { level: '40', name: '巨螺蝓', type: 'mutation', element: ['earth', 'lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },
    { level: '40', name: '自走人偶守护者', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '40', name: '迷途哈奥卡', type: 'mutation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级41
    { level: '41', name: '涌火海石龟', type: 'adaptation', element: ['water'], timePeriod: 'sun-moon', weather: ['umbralWind'] },
    { level: '41', name: '火焰之翼', type: 'mutation', element: ['wind', 'fire'], timePeriod: 'sun', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '41', name: '滴水石像鬼', type: 'mutation', element: ['lightning', 'earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级42
    { level: '42 + 1', name: '海栖马', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '42', name: '瓦尔长毛象', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '42', name: '瓦尔幽灵', type: 'mutation', element: ['ice', 'lightning'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级43
    { level: '43', name: '短剑剑齿虎', type: 'mutation', element: ['earth', 'ice'], timePeriod: 'sun-moon', weather: ['blizzards'] },
    { level: '43', name: '涌火巨水蛇', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '43', name: '余烬元精', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },

    // 等级44
    { level: '44', name: '赤目墨水瓶', type: 'mutation', element: ['water'], timePeriod: 'sun-moon', weather: ['umbralWind'] },
    { level: '44', name: '瓦尔雪人', type: 'mutation', element: ['ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '44', name: '暗黑行吟诗人', type: 'adaptation', element: ['earth'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级45
    { level: '45', name: '锋螯陆蟹', type: 'mutation', element: ['fire', 'water'], timePeriod: 'sun', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '45', name: '北境鳐', type: 'mutation', element: ['water', 'lightning'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '45', name: '涌火龙虾', type: 'adaptation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级46
    { level: '46', name: '涌火爆弹鱼', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '46', name: '涌火软糊怪', type: 'mutation', element: ['fire', 'water'], timePeriod: 'sun-moon', weather: ['blizzards'] },
    { level: '46', name: '雷暴元精', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },

    // 等级47
    { level: '47 + 1', name: '涌火南加', type: 'mutation', element: ['water', 'ice'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '47', name: '涌火狼獾', type: 'mutation', element: ['fire', 'lightning'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '47', name: '涌火帕尔忒诺珀', type: 'adaptation', element: ['lightning'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级48
    { level: '48', name: '纯白', type: 'mutation', element: ['water', 'ice'], timePeriod: 'sun-moon', weather: ['umbralWind'] },
    { level: '48', name: '丁格犬', type: 'mutation', element: ['earth', 'wind'], timePeriod: 'sun', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '48', name: '涌火帕尔忒诺珀', type: 'adaptation', element: ['lightning'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级49
    { level: '49', name: '涌火粘液怪', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '49', name: '北境灰熊', type: 'mutation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '49 + 1', name: '暗黑帕尔忒诺珀', type: 'mutation', element: ['lightning', 'fire'], timePeriod: 'moon', weather: ['thunder'] },

    // 等级50
    { level: '50', name: '瓦尔皮拉鱼', type: 'mutation', element: ['fire', 'water'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '50', name: '涌火鹰蜂', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '50', name: '达菲妮', type: 'mutation', element: ['water', 'fire'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级51
    { level: '51', name: '涌火树木巨像', type: 'mutation', element: ['earth', 'lightning'], timePeriod: 'sun-moon', weather: ['snow'] },
    { level: '51', name: '涌火天仙子', type: 'mutation', element: ['wind', 'earth'], timePeriod: 'sun', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '51', name: '达菲妮', type: 'adaptation', element: ['water'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级52
    { level: '52', name: '瓦尔米诺陶诺斯', type: 'mutation', element: ['fire', 'lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },
    { level: '52', name: '瓦尔犀鸟', type: 'mutation', element: ['wind', 'fire'], timePeriod: 'sun-moon', weather: ['heatWaves'] },
    { level: '52', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow', 'blizzards'] },

    // 等级53
    { level: '53', name: '剑角龙', type: 'mutation', element: ['water', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '53', name: '复制僧伽', type: 'mutation', element: ['earth'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '53', name: '无魂代理人', type: 'adaptation', element: ['ice'], timePeriod: 'moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },

    // 等级54
    { level: '54', name: '瘤牛', type: 'mutation', element: ['earth'], timePeriod: 'sun-moon', weather: ['snow'] },
    { level: '54', name: '虚无远古之龙', type: 'mutation', element: ['fire', 'water'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '54', name: '雷暴元精', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['thunder'] },

    // 等级55
    { level: '55', name: '瓦尔巨猿', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'sun-moon', weather: ['umbralWind'] },
    { level: '55', name: '虚无炎龙', type: 'adaptation', element: ['fire'], timePeriod: 'sun-moon', weather: ['fairSkies', 'heatWaves', 'thunder', 'snow', 'blizzards', 'umbralWind'] },
    { level: '55', name: '无魂寻路人', type: 'mutation', element: ['ice'], timePeriod: 'moon', weather: ['thunder'] },
    { level: '55', name: '台风元精 ', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['umbralWind'] },
  ],
  'area.EurekaHydatos': [
    // 等级50
    { level: '50', name: '优雷卡死亡凝视', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '50', name: '瓦尔南加', type: 'mutation', element: ['water', 'earth'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级51
    { level: '51', name: '丰水软糊怪', type: 'adaptation', element: ['earth'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '51', name: '研究所长须豹', type: 'mutation', element: ['fire', 'wind'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级52
    { level: '52', name: '瓦尔沙蚤', type: 'mutation', element: ['wind', 'earth'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '52', name: '无魂搜寻者', type: 'adaptation', element: ['ice'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级53
    { level: '53', name: '丰水榴弹怪', type: 'mutation', element: ['earth', 'fire'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '53', name: '雷暴元精', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['thunderstorms'] },
    // 等级54
    { level: '54', name: '筑巢公雏鸟', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '54', name: '研究所沟鼠', type: 'mutation', element: ['ice', 'lightning'], timePeriod: 'sun-moon', weather: ['thunderstorms'] },
    // 等级55
    { level: '55', name: '丰水奇纳哈尔鸟妖', type: 'mutation', element: ['wind', 'ice'], timePeriod: 'sun-moon', weather: ['snow'] },
    { level: '55', name: '孤独象魔', type: 'mutation', element: ['earth', 'water'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '55', name: '融雪元精', type: 'mutation', element: ['water'], timePeriod: 'sun-moon', weather: ['showers'] },
    // 等级56
    { level: '56', name: '瓦尔火尾飞蜥', type: 'mutation', element: ['ice', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '56', name: '瓦尔羚羊', type: 'mutation', element: ['fire', 'lightning'], timePeriod: 'sun-moon', weather: ['snow'] },
    { level: '56', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow'] },
    // 等级57
    { level: '57', name: '湖畔虾蛄', type: 'mutation', element: ['water', 'earth'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '57', name: '艾欧晶片', type: 'adaptation', element: ['lightning'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '57', name: '暗黑骑手', type: 'mutation', element: ['wind', 'lightning'], timePeriod: 'moon', weather: ['thunderstorms'] },
    // 等级58
    { level: '58', name: '人偶013BL', type: 'mutation', element: ['ice', 'wind'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '58', name: '生锈恐慌装甲', type: 'mutation', element: ['fire', 'earth'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '58', name: '暗黑骑手', type: 'adaptation', element: ['wind'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级59
    { level: '59', name: '虚无薇薇尔飞龙', type: 'mutation', element: ['lightning', 'ice'], timePeriod: 'sun-moon', weather: ['showers'] },
    { level: '59', name: '修验天狗', type: 'mutation', element: ['wind', 'water'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '59', name: '丰水幽灵', type: 'adaptation', element: ['fire'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级60
    { level: '60', name: '滚滚叶小妖', type: 'mutation', element: ['wind', 'earth'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '60', name: '瓦尔螳螂', type: 'mutation', element: ['ice', 'water'], timePeriod: 'sun-moon', weather: ['showers'] },
    { level: '60', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow'] },
    // 等级61
    { level: '61', name: '丰水爆壳怪', type: 'adaptation', element: ['water'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '61', name: '瓦尔鼹鼠', type: 'mutation', element: ['earth', 'fire'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '61', name: '雷暴元精', type: 'mutation', element: ['lightning', 'water'], timePeriod: 'moon', weather: ['thunderstorms'] },
    // 等级62
    { level: '62', name: '未知食人魔', type: 'mutation', element: ['ice', 'fire'], timePeriod: 'sun-moon', weather: ['fairSkies'] },
    { level: '62', name: '丰水巨猿', type: 'mutation', element: ['ice', 'wind'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '62', name: '武士腐尸', type: 'adaptation', element: ['water'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    // 等级63
    { level: '63', name: '筑巢祖', type: 'adaptation', element: ['wind'], timePeriod: 'sun-moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '63', name: '研究所黑豺', type: 'mutation', element: ['ice', 'lightning'], timePeriod: 'sun-moon', weather: ['thunderstorms'] },
    { level: '63', name: '融雪元精', type: 'mutation', element: ['water'], timePeriod: 'sun', weather: ['showers'] },
    // 等级64
    { level: '64', name: '丰水毒蜥蜴', type: 'mutation', element: ['wind', 'ice'], timePeriod: 'sun', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '64', name: '暗黑石像鬼', type: 'mutation', element: ['lightning', 'wind'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '64', name: '雪暴元精', type: 'adaptation', element: ['ice'], timePeriod: 'sun-moon', weather: ['snow'] },
    // 等级65
    { level: '65', name: '风水瘤牛', type: 'mutation', element: ['earth', 'ice'], timePeriod: 'sun-moon', weather: ['snow'] },
    { level: '65', name: '虚无双足飞龙', type: 'mutation', element: ['lightning', 'fire'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
    { level: '65', name: '武士腐尸', type: 'adaptation', element: ['water'], timePeriod: 'moon', weather: ['fairSkies', 'showers', 'gloom', 'thunderstorms', 'snow'] },
  ],
}

export const eurekaAreaWeatherRates: Record<EurekaAreaId, WeatherRate[]> = {
  'area.EurekaAnemos': [
    { rate: 30, name: '晴朗', weather: 'fairSkies', color: '' },
    { rate: 30, name: '强风', weather: 'gales', color: '' },
    { rate: 30, name: '暴雨', weather: 'showers', color: '' },
    { rate: -1, name: '小雪', weather: 'snow', color: '' },
  ],
  'area.EurekaPagos': [
    { rate: 10, name: '晴朗', weather: 'fairSkies', color: '' },
    { rate: 18, name: '薄雾', weather: 'fog', color: '' },
    { rate: 18, name: '热浪', weather: 'heatWaves', color: '' },
    { rate: 18, name: '小雪', weather: 'snow', color: '' },
    { rate: 18, name: '打雷', weather: 'thunder', color: '' },
    { rate: -1, name: '暴雪', weather: 'blizzards', color: '' },
  ],
  'area.EurekaPyros': [
    { rate: 10, name: '晴朗', weather: 'fairSkies', color: '' },
    { rate: 18, name: '热浪', weather: 'heatWaves', color: '' },
    { rate: 18, name: '打雷', weather: 'thunder', color: '' },
    { rate: 18, name: '暴雪', weather: 'blizzards', color: '' },
    { rate: 18, name: '灵风', weather: 'umbralWind', color: '' },
    { rate: -1, name: '小雪', weather: 'snow', color: '' },
  ],
  'area.EurekaHydatos': [
    { rate: 12, name: '晴朗', weather: 'fairSkies', color: '' },
    { rate: 22, name: '暴雨', weather: 'showers', color: '' },
    { rate: 22, name: '妖雾', weather: 'gloom', color: '' },
    { rate: 22, name: '雷雨', weather: 'thunderstorms', color: '' },
    { rate: -1, name: '小雪', weather: 'snow', color: '' },
  ],
}

export const eurekaAreaFates: Record<EurekaAreaId, Fate[]> = {
  'area.EurekaAnemos': [
    {
      name: '科里多仙人刺',
      level: 1,
      title: '舞动花王',
      aliases: ['仙人掌'],
      triggerCondition: { monster: '仙人花', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '常风水晶', icon: '020028', quantity: 3 },
      ],
    },
    {
      name: '常风领主',
      level: 2,
      title: '章鱼统领',
      aliases: ['章鱼'],
      triggerCondition: { monster: '海祭司', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '常风水晶', icon: '020028', quantity: 6 },
      ],
      specialRewards: [{ name: '常风王子', icon: '059687' }],
    },
    {
      name: '忒勒斯',
      level: 3,
      title: '绝命美声',
      aliases: ['小鸟', '鸟', '下面的鸟'],
      triggerCondition: { monster: '常风哈佩亚鸟妖', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '常风水晶', icon: '020028', quantity: 9 },
      ],
    },
    {
      name: '常风皇帝',
      level: 4,
      title: '御驾亲征',
      aliases: ['蜻蜓'],
      triggerCondition: { monster: '晏蜓', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '常风水晶', icon: '020028', quantity: 12 },
      ],
      specialRewards: [{ name: '皇帝飞虫的薄翼发饰', icon: '040787' }],
    },
    {
      name: '卡利斯托',
      level: 5,
      title: '行尸走肉',
      aliases: ['熊'],
      triggerCondition: { monster: '瓦尔巨熊', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '常风水晶', icon: '020028', quantity: 15 },
      ],
    },
    {
      name: '群偶',
      level: 6,
      title: '无主傀儡',
      aliases: [],
      triggerCondition: { monster: '夺灵魔', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 10 },
        { name: '常风水晶', icon: '020028', quantity: 18 },
      ],
    },
    {
      name: '哲罕南',
      level: 7,
      title: '强风妖精',
      aliases: ['强风元精'],
      triggerCondition: { monster: '台风元精', night: false, weather: { name: '强风', weather: 'gales' } },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 11 },
        { name: '常风水晶', icon: '020028', quantity: 21 },
      ],
    },
    {
      name: '阿米特',
      level: 8,
      title: '贪食者',
      aliases: ['暴龙'],
      triggerCondition: { monster: '阿卜拉克萨斯', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 12 },
        { name: '常风水晶', icon: '020028', quantity: 24 },
      ],
    },
    {
      name: '盖因',
      level: 9,
      title: '兽脚怪人',
      aliases: ['盖因', '大脚', '席兹'],
      triggerCondition: { monster: '追踪席兹', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 13 },
        { name: '常风水晶', icon: '020028', quantity: 26 },
      ],
    },
    {
      name: '庞巴德',
      level: 10,
      title: '腐臭贤者',
      aliases: ['举高高'],
      triggerCondition: { monster: '古老贪吃鬼', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 14 },
        { name: '常风水晶', icon: '020028', quantity: 28 },
      ],
    },
    {
      name: '塞尔凯特',
      level: 11,
      title: '幻魔蝎',
      aliases: ['蝎子'],
      triggerCondition: { monster: '河道巨钳虾', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 15 },
        { name: '常风水晶', icon: '020028', quantity: 30 },
      ],
      specialRewards: [
        { name: '毒蝎格斗服', icon: '043392' },
        { name: '米斯拉人偶', icon: '059686' },
      ],
    },
    {
      name: '武断魔花茱莉卡',
      level: 12,
      title: '播种者',
      aliases: ['魔界花', '花'],
      triggerCondition: { monster: '天仙子', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 16 },
        { name: '常风水晶', icon: '020028', quantity: 32 },
      ],
    },
    {
      name: '白骑士',
      level: 13,
      title: '胜利象征',
      aliases: [],
      triggerCondition: { monster: '黄昏无头骑士', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 17 },
        { name: '常风水晶', icon: '020028', quantity: 34 },
      ],
    },
    {
      name: '波吕斐摩斯',
      level: 14,
      title: '巨人的复仇',
      aliases: ['独眼', '大眼'],
      triggerCondition: { monster: '独眼怪', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 18 },
        { name: '常风水晶', icon: '020028', quantity: 36 },
      ],
    },
    {
      name: '阔步西牟鸟',
      level: 15,
      title: '狂怒怪鸟',
      aliases: ['祖', '大鸟', '上面的鸟'],
      triggerCondition: { monster: '旧世界祖', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 19 },
        { name: '常风水晶', icon: '020028', quantity: 38 },
      ],
      specialRewards: [{ name: '阔步高筒靴', icon: '049134' }],
    },
    {
      name: '极其危险物质',
      level: 16,
      title: '放火大王',
      aliases: ['爆弹', '肥宅', '胖子'],
      triggerCondition: { monster: '常风阿那罗', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 20 },
        { name: '常风水晶', icon: '020028', quantity: 40 },
      ],
    },
    {
      name: '法夫纳',
      level: 17,
      title: '狂乱暗龙',
      aliases: ['法夫纳', 'ffn'],
      triggerCondition: { monster: '龙化石', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 21 },
        { name: '常风水晶', icon: '020028', quantity: 43 },
      ],
      specialRewards: [{ name: '迷你法夫纳', icon: '059685' }],
    },
    {
      name: '阿玛洛克',
      level: 18,
      title: '异界魔犬',
      aliases: ['狗'],
      triggerCondition: { monster: '虚无鳞龙', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 22 },
        { name: '常风水晶', icon: '020028', quantity: 46 },
      ],
    },
    {
      name: '拉玛什图',
      level: 19,
      title: '魔王之后',
      aliases: ['嫂子'],
      triggerCondition: { monster: '瓦尔妖影', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 23 },
        { name: '常风水晶', icon: '020028', quantity: 48 },
      ],
    },
    {
      name: '帕祖祖',
      level: 20,
      title: '暴风魔王',
      aliases: ['帕祖祖', 'pzz', '岛主'],
      triggerCondition: { monster: '暗影幽灵', night: true, weather: { name: '强风', weather: 'gales' } },
      description: '',
      normalRewards: [
        { name: '常风地带上锁的宝箱', icon: '025997', quantity: 25 },
        { name: '常风水晶', icon: '020028', quantity: 50 },
        { name: '帕祖祖的羽毛', icon: '021910', quantity: 3 },
      ],
      specialRewards: [
        { name: '帕祖祖的祭坛', icon: '053196' },
        { name: '九宫幻卡：帕祖祖', icon: '027664' },
      ],
    },
  ],
  'area.EurekaPagos': [
    {
      name: '雪之女王',
      level: 20,
      title: '纯白的支配者',
      aliases: ['周冬雨', 'zdy'],
      triggerCondition: { monster: '雪童子', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 1 },
        { name: '恒冰水晶', icon: '020030', quantity: 8 },
      ],
      specialRewards: [{ name: '九宫幻卡：雪童子', icon: '027663' }],
    },
    {
      name: '塔克西姆',
      level: 21,
      title: '腐烂的读书家',
      aliases: ['读书人'],
      triggerCondition: { monster: '珍卷恶魔', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 2 },
        { name: '恒冰水晶', icon: '020030', quantity: 9 },
      ],
    },
    {
      name: '灰烬龙',
      level: 22,
      title: '灰壳的鳞王',
      aliases: [],
      triggerCondition: { monster: '血魔', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 2 },
        { name: '恒冰水晶', icon: '020030', quantity: 10 },
      ],
    },
    {
      name: '异形魔虫',
      level: 23,
      title: '地壳变动之谜',
      aliases: ['虫'],
      triggerCondition: { monster: '瓦尔巨虫', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 3 },
        { name: '恒冰水晶', icon: '020030', quantity: 12 },
      ],
    },
    {
      name: '安娜波',
      level: 24,
      title: '融雪的化身',
      aliases: [],
      triggerCondition: { monster: '融雪元精', night: false, weather: { name: '薄雾', weather: 'fog' } },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 3 },
        { name: '恒冰水晶', icon: '020030', quantity: 14 },
      ],
    },
    {
      name: '白泽',
      level: 25,
      title: '五行眼的主人',
      aliases: ['白泽', 'bz'],
      triggerCondition: { monster: '啜泣百目妖', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '恒冰水晶', icon: '020030', quantity: 16 },
      ],
    },
    {
      name: '雪屋王',
      level: 26,
      title: '移动的雪洞',
      aliases: ['雪人'],
      triggerCondition: { monster: '胡瓦西', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '恒冰水晶', icon: '020030', quantity: 18 },
      ],
    },
    {
      name: '阿萨格',
      level: 27,
      title: '硬质的病魔',
      aliases: ['阿萨格', 'asg'],
      triggerCondition: { monster: '徘徊欧浦肯', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '恒冰水晶', icon: '020030', quantity: 20 },
      ],
    },
    {
      name: '苏罗毗',
      level: 28,
      title: '家畜的慈母',
      aliases: ['羊'],
      triggerCondition: { monster: '恒冰公山羊', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '恒冰水晶', icon: '020030', quantity: 22 },
      ],
    },
    {
      name: '亚瑟罗王',
      level: 29,
      title: '圆桌的雾王',
      aliases: ['螃蟹', 'px'],
      triggerCondition: { monster: '瓦尔利螯陆蟹', night: false, weather: { name: '薄雾', weather: 'fog' } },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '恒冰水晶', icon: '020030', quantity: 24 },
      ],
      specialRewards: [{ name: '闪袭指环', icon: '054483' }],
    },
    {
      name: '唇亡齿寒',
      level: 30,
      title: '唇亡齿寒',
      aliases: ['双牛'],
      triggerCondition: { monster: '研究所弥诺陶洛斯', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '恒冰水晶', icon: '020030', quantity: 26 },
      ],
    },
    {
      name: '优雷卡圣牛',
      level: 31,
      title: '野牛的救世主',
      aliases: ['圣牛'],
      triggerCondition: { monster: '古老水牛', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '恒冰水晶', icon: '020030', quantity: 28 },
      ],
    },
    {
      name: '哈达约什',
      level: 32,
      title: '雷云的魔兽',
      aliases: ['贝爷'],
      triggerCondition: { monster: '虚无小龙', night: false, weather: { name: '打雷', weather: 'thunder' } },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '恒冰水晶', icon: '020030', quantity: 30 },
      ],
      specialRewards: [
        { name: '贝希摩斯之角', icon: '022205' },
        { name: '贝希摩斯的毛皮', icon: '021830' },
      ],
    },
    {
      name: '荷鲁斯',
      level: 33,
      title: '太阳的使者',
      aliases: ['荷鲁斯', 'hls'],
      triggerCondition: { monster: '虚无薇薇尔飞龙', night: false, weather: { name: '热浪', weather: 'heatWaves' } },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '恒冰水晶', icon: '020030', quantity: 32 },
      ],
    },
    {
      name: '总领安哥拉·曼纽',
      level: 34,
      title: '暗眼王',
      aliases: ['大眼', '安总', '安哥'],
      triggerCondition: { monster: '瞪视之眼', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '恒冰水晶', icon: '020030', quantity: 34 },
      ],
    },
    {
      name: '复制魔花凯西',
      level: 35,
      title: '模仿犯',
      aliases: ['凯西', 'kx', '老婆'],
      triggerCondition: { monster: '阿米雷戴', night: false, weather: { name: '暴雪', weather: 'blizzards' } },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '恒冰水晶', icon: '020030', quantity: 40 },
      ],
      specialRewards: [{ name: '凯西耳坠', icon: '055423' }],
    },
    {
      name: '娄希',
      level: 35,
      title: '苍蓝冰刃',
      aliases: ['娄希', 'lx', '岛主'],
      triggerCondition: { monster: '瓦尔腐尸', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '恒冰地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '恒冰水晶', icon: '020030', quantity: 40 },
        { name: '娄希的冰片', icon: '021266', quantity: 2 },
      ],
      specialRewards: [{ name: '九宫幻卡：娄希', icon: '027664' }],
    },
  ],
  'area.EurekaPyros': [
    {
      name: '琉科西亚',
      level: 35,
      title: '洁白的惨叫',
      aliases: ['惨叫'],
      triggerCondition: { monster: '涌火浮灵', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 1 },
        { name: '涌火水晶', icon: '020032', quantity: 8 },
      ],
      specialRewards: [{ name: '未鉴定的治愈文理碎晶', icon: '020036' }],
    },
    {
      name: '佛劳洛斯',
      level: 36,
      title: '狰狞的雷兽',
      aliases: ['雷兽'],
      triggerCondition: { monster: '雷暴元精', night: false, weather: { name: '打雷', weather: 'thunder' } },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 2 },
        { name: '涌火水晶', icon: '020032', quantity: 9 },
      ],
      specialRewards: [{ name: '未鉴定的守势文理碎晶', icon: '020036' }],
    },
    {
      name: '诡辩者',
      level: 37,
      title: '妖异中的辩论家',
      aliases: ['诡辩'],
      triggerCondition: { monster: '涌火阿班达', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 2 },
        { name: '涌火水晶', icon: '020032', quantity: 10 },
      ],
      specialRewards: [{ name: '未鉴定的妨碍文理碎晶', icon: '020036' }],
    },
    {
      name: '格拉菲亚卡内',
      level: 38,
      title: '恐怖的人偶',
      aliases: ['塔塔露', '娃娃', 'ttl'],
      triggerCondition: { monster: '瓦尔维京人偶', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 3 },
        { name: '涌火水晶', icon: '020032', quantity: 12 },
      ],
      specialRewards: [
        { name: '未鉴定的治愈文理碎晶', icon: '020036' },
        { name: '卡尔克', icon: '059577' },
      ],
    },
    {
      name: '阿斯卡拉福斯',
      level: 39,
      title: '图书守护者',
      aliases: ['阿福'],
      triggerCondition: { monster: '过期魔导书', night: false, weather: { name: '灵风', weather: 'umbralWind' } },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 3 },
        { name: '涌火水晶', icon: '020032', quantity: 14 },
      ],
      specialRewards: [{ name: '未鉴定的守势文理碎晶', icon: '020036' }],
    },
    {
      name: '巴钦大公爵',
      level: 40,
      title: '深渊贵族',
      aliases: ['大公'],
      triggerCondition: { monster: '暗黑行吟诗人', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '涌火水晶', icon: '020032', quantity: 16 },
      ],
      specialRewards: [{ name: '未鉴定的妨碍文理碎晶', icon: '020036' }],
    },
    {
      name: '埃托洛斯',
      level: 41,
      title: '闪电的指挥者',
      aliases: ['雷鸟'],
      triggerCondition: { monster: '瓦尔独爪妖禽', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '涌火水晶', icon: '020032', quantity: 18 },
      ],
      specialRewards: [{ name: '未鉴定的治愈文理碎晶', icon: '020036' }],
    },
    {
      name: '来萨特',
      level: 42,
      title: '灼热的刺剑',
      aliases: ['蝎子'],
      triggerCondition: { monster: '食鸟者', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '涌火水晶', icon: '020032', quantity: 20 },
      ],
      specialRewards: [{ name: '未鉴定的守势文理碎晶', icon: '020036' }],
    },
    {
      name: '火巨人',
      level: 43,
      title: '炎热霸主',
      aliases: [],
      triggerCondition: { monster: '涌火陆蟹', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '涌火水晶', icon: '020032', quantity: 22 },
      ],
      specialRewards: [{ name: '未鉴定的妨碍文理碎晶', icon: '020036' }],
    },
    {
      name: '伊丽丝',
      level: 44,
      title: '落泪的海燕',
      aliases: ['海燕', '燕子'],
      triggerCondition: { monster: '北境盐蓝燕', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '涌火水晶', icon: '020032', quantity: 24 },
      ],
      specialRewards: [{ name: '未鉴定的治愈文理碎晶', icon: '020036' }],
    },
    {
      name: '佣兵雷姆普里克斯',
      level: 45,
      title: '奇迹的生还者',
      aliases: ['哥布林', '佣兵', 'gbl'],
      triggerCondition: { monster: '青蓝之手逃亡者', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '涌火水晶', icon: '020032', quantity: 26 },
      ],
      specialRewards: [
        { name: '未鉴定的守势文理碎晶', icon: '020036' },
        { name: '雷姆普里克斯骰子', icon: '026253' },
      ],
    },
    {
      name: '闪电督军',
      level: 46,
      title: '雷兽统领',
      aliases: ['雷军'],
      triggerCondition: { monster: '遗弃象魔', night: false, weather: { name: '打雷', weather: 'thunder' } },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '涌火水晶', icon: '020032', quantity: 28 },
      ],
      specialRewards: [{ name: '未鉴定的妨碍文理碎晶', icon: '020036' }],
    },
    {
      name: '樵夫杰科的死亡对决',
      level: 47,
      title: '',
      aliases: ['树人'],
      triggerCondition: { monster: '涌火树精', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '涌火水晶', icon: '020032', quantity: 30 },
      ],
      specialRewards: [
        { name: '未鉴定的治愈文理碎晶', icon: '020036' },
        { name: '艾尔凡人偶', icon: '059714' },
      ],
    },
    {
      name: '明眸',
      level: 48,
      title: '智慧与战斗之母',
      aliases: ['明眸', 'mm'],
      triggerCondition: { monster: '瓦尔斯卡尼特', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '涌火水晶', icon: '020032', quantity: 32 },
      ],
      specialRewards: [{ name: '未鉴定的守势文理碎晶', icon: '020036' }],
    },
    {
      name: '阴·阳',
      level: 49,
      title: '相反的双子',
      aliases: ['阴阳', 'yy'],
      triggerCondition: { monster: '涌火百目妖', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '涌火水晶', icon: '020032', quantity: 34 },
      ],
      specialRewards: [
        { name: '未鉴定的妨碍文理碎晶', icon: '020036' },
        { name: '阴·阳的皮膜', icon: '021955' },
      ],
    },
    {
      name: '斯库尔',
      level: 50,
      title: '嘲讽的霜狼',
      aliases: ['狼', '狗子', 'lw'],
      triggerCondition: { monster: '涌火狗灵', night: false, weather: { name: '暴雪', weather: 'blizzards' } },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '涌火水晶', icon: '020032', quantity: 40 },
      ],
      specialRewards: [
        { name: '未鉴定的守势文理碎晶', icon: '020036' },
        { name: '斯库尔的牙', icon: '022303' },
      ],
    },
    {
      name: '彭忒西勒亚',
      level: 50,
      title: '炎蝶的女王',
      aliases: ['女人', '小彭', '岛主'],
      triggerCondition: { monster: '瓦尔血飞蛾', night: false, weather: { name: '热浪', weather: 'heatWaves' } },
      description: '',
      normalRewards: [
        { name: '涌火地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '涌火水晶', icon: '020032', quantity: 40 },
        { name: '彭忒西勒亚的火种', icon: '025911', quantity: 3 },
      ],
      specialRewards: [
        { name: '未鉴定的治愈文理碎晶', icon: '020036' },
        { name: '九宫幻卡：彭忒西勒亚', icon: '027664' },
      ],
    },
  ],
  'area.EurekaHydatos': [
    {
      name: '卡拉墨鱼',
      level: 50,
      title: '奇怪的乌贼',
      aliases: ['墨鱼'],
      triggerCondition: { monster: '左米特', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '丰水水晶', icon: '020037', quantity: 5 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '剑齿象',
      level: 51,
      title: '暴虐的魔兽',
      aliases: ['象', '大象'],
      triggerCondition: { monster: '丰水曙象', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 4 },
        { name: '丰水水晶', icon: '020037', quantity: 5 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '摩洛',
      level: 52,
      title: '落泪的君主',
      aliases: ['摩洛', 'ml'],
      triggerCondition: { monster: '瓦尔泥口花', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '丰水水晶', icon: '020037', quantity: 6 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
        { name: '摩洛的角', icon: '022205' },
      ],
    },
    {
      name: '皮艾萨邪鸟',
      level: 53,
      title: '惊鸿艳影',
      aliases: ['皮鸟', '鸟'],
      triggerCondition: { monster: '多彩冠恐鸟', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 5 },
        { name: '丰水水晶', icon: '020037', quantity: 6 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '霜鬃猎魔',
      level: 54,
      title: '高傲的猎人',
      aliases: ['老虎'],
      triggerCondition: { monster: '北方猛虎', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '丰水水晶', icon: '020037', quantity: 7 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '达佛涅',
      level: 55,
      title: '浴血的妖妃',
      aliases: ['达佛涅', 'dfn'],
      triggerCondition: { monster: '暗黑虚无鬼鱼', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 6 },
        { name: '丰水水晶', icon: '020037', quantity: 7 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '戈尔德马尔王',
      level: 56,
      title: '异界的锻冶王',
      aliases: ['马王', 'mw'],
      triggerCondition: { monster: '丰水幽灵', night: true, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '丰水水晶', icon: '020037', quantity: 8 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
        { name: '九宫幻卡：矮儒', icon: '027663' },
        { name: '戈尔德马尔的角', icon: '022204' },
      ],
    },
    {
      name: '琉刻',
      level: 57,
      title: '食妖植物',
      aliases: ['琉刻', 'lk'],
      triggerCondition: { monster: '虎鹰', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 7 },
        { name: '丰水水晶', icon: '020037', quantity: 8 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '巴龙',
      level: 58,
      title: '业火狮子王',
      aliases: ['巴龙', '狮子', 'bl'],
      triggerCondition: { monster: '研究所雄狮', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '丰水水晶', icon: '020037', quantity: 9 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
      ],
    },
    {
      name: '刻托',
      level: 59,
      title: '魔蛇女王',
      aliases: ['刻托', 'kt'],
      triggerCondition: { monster: '丰水达菲妮', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 8 },
        { name: '丰水水晶', icon: '020037', quantity: 9 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
        { name: '刻托的爪子', icon: '022301' },
      ],
    },
    {
      name: '起源守望者',
      level: 60,
      title: '水晶之龙',
      aliases: ['水晶龙', '岛主'],
      triggerCondition: { monster: '水晶爪', night: false, weather: null },
      description: '',
      normalRewards: [
        { name: '丰水地带上锁的宝箱', icon: '025997', quantity: 9 },
        { name: '丰水水晶', icon: '020037', quantity: 10 },
        { name: '水晶龙之鳞', icon: '022265', quantity: 3 },
      ],
      specialRewards: [
        { name: '未鉴定的封印文理碎晶', icon: '020036' },
        { name: '丰水晶簇', icon: '020014' },
        { name: '九宫幻卡：起源守望者', icon: '027664' },
      ],
    },
  ],
}

export const eurekaLogosCrystal: LogosCrystal[] = [
  {
    name: '未鉴定的新锐文理碎晶',
    icon: '020034',
    logos: [
      { name: '术士的记忆', icon: '027952' },
      { name: '斗士的记忆', icon: '027952' },
      { name: '重骑兵的记忆', icon: '027951' },
      { name: '文理激怒', icon: '027951' },
      { name: '文理治疗', icon: '027953' },
      { name: '文理后跳', icon: '027954' },
      { name: '文理麻痹', icon: '027955' },
    ],
  },
  {
    name: '未鉴定的熟练文理碎晶',
    icon: '020035',
    logos: [
      { name: '文理康复', icon: '027953' },
      { name: '文理复活', icon: '027953' },
      { name: '文理虚枪', icon: '027954' },
      { name: '文理镇定', icon: '027955' },
      { name: '文理护盾', icon: '027956' },
    ],
  },
  {
    name: '未鉴定的攻势文理碎晶',
    icon: '020036',
    logos: [
      { name: '武人的记忆', icon: '027952' },
      { name: '文理浴血', icon: '027952' },
    ],
  },
  {
    name: '未鉴定的守势文理碎晶',
    icon: '020036',
    logos: [
      { name: '守护者的记忆', icon: '027951' },
      { name: '英杰的加护', icon: '027951' },
    ],
  },
  {
    name: '未鉴定的治愈文理碎晶',
    icon: '020036',
    logos: [
      { name: '祭司的记忆', icon: '027953' },
      { name: '文理救疗', icon: '027953' },
    ],
  },
  {
    name: '未鉴定的斥候文理碎晶',
    icon: '020036',
    logos: [
      { name: '纹理飘羽步', icon: '027954' },
      { name: '文理潜行', icon: '027954' },
    ],
  },
  {
    name: '未鉴定的妨碍文理碎晶',
    icon: '020036',
    logos: [
      { name: '文理精神镖', icon: '027955' },
      { name: '文理驱魔', icon: '027955' },
    ],
  },
  {
    name: '未鉴定的支援文理碎晶',
    icon: '020036',
    logos: [
      { name: '文理魔盾', icon: '027956' },
      { name: '文理石肤', icon: '027956' },
    ],
  },
  {
    name: '未鉴定的封印文理碎晶',
    icon: '020036',
    logos: [
      { name: '盗贼的记忆', icon: '027954' },
      { name: '文理魔法爆发', icon: '027952' },
      { name: '文理双刃剑', icon: '027952' },
      { name: '文理锐眼追击', icon: '027952' },
    ],
  },
]
