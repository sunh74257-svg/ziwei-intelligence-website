const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
let src = fs.readFileSync(path.join(root, "index.html"), "utf8");

const pathFixes = [
  ['href="favicon.ico"', 'href="../favicon.ico"'],
  ['href="assets/css/', 'href="../assets/css/'],
  ['href="assets/js/', 'href="../assets/js/'],
  ['href="assets/images/', 'href="../assets/images/'],
  ['src="assets/js/', 'src="../assets/js/'],
  ['src="assets/images/', 'src="../assets/images/'],
  ['srcset="assets/images/', 'srcset="../assets/images/'],
];
for (const [a, b] of pathFixes) src = src.split(a).join(b);

src = src.replace('lang="zh-CN"', 'lang="en"');

const headEarlyScroll = `  <script>
    if (location.hash) {
      document.documentElement.style.scrollBehavior = "auto";
    }
  </script>
`;

if (!src.includes("location.hash)")) {
  src = src.replace("  <link rel=\"icon\" href=\"../favicon.ico\"", `${headEarlyScroll}  <link rel=\"icon\" href=\"../favicon.ico"`);
}

const headOld = `  <title>紫微智能科技 | AI 算能基础设施</title>
  <meta name="description" content="紫微智能科技提供高性能 GPU 集群、弹性算力平台与全栈 AI 服务，覆盖模型训练、推理加速与企业级私有化部署，助力企业 AI 算能基础设施建设。" />
  <link rel="canonical" href="https://www.ziwei.ink/" />
  <link rel="alternate" hreflang="zh-CN" href="https://www.ziwei.ink/" />
  <link rel="alternate" hreflang="en" href="https://www.ziwei.ink/en/" />
  <link rel="alternate" hreflang="x-default" href="https://www.ziwei.ink/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="zh_CN" />
  <meta property="og:title" content="紫微智能科技 | AI 算能基础设施" />
  <meta property="og:description" content="紫微智能科技提供高性能 GPU 集群、弹性算力平台与全栈 AI 服务，覆盖模型训练、推理加速与企业级私有化部署。" />
  <meta property="og:url" content="https://www.ziwei.ink/" />
  <meta property="og:site_name" content="紫微智能科技" />
  <meta property="og:image" content="https://www.ziwei.ink/assets/images/hero-ai-platform.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="紫微智能科技 | AI 算能基础设施" />
  <meta name="twitter:description" content="紫微智能科技提供高性能 GPU 集群、弹性算力平台与全栈 AI 服务，覆盖模型训练、推理加速与企业级私有化部署。" />
  <meta name="twitter:image" content="https://www.ziwei.ink/assets/images/hero-ai-platform.png" />`;

const headNew = `  <title>ZIWEI Tech | AI Compute Infrastructure</title>
  <meta name="description" content="ZIWEI Tech delivers high-performance GPU clusters, elastic AI compute platforms, and full-stack services for model training, accelerated inference, and private enterprise deployment." />
  <link rel="canonical" href="https://www.ziwei.ink/en/" />
  <link rel="alternate" hreflang="zh-CN" href="https://www.ziwei.ink/" />
  <link rel="alternate" hreflang="en" href="https://www.ziwei.ink/en/" />
  <link rel="alternate" hreflang="x-default" href="https://www.ziwei.ink/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="ZIWEI Tech | AI Compute Infrastructure" />
  <meta property="og:description" content="High-performance GPU clusters, elastic AI compute platforms, and full-stack AI services for training, inference, and enterprise deployment." />
  <meta property="og:url" content="https://www.ziwei.ink/en/" />
  <meta property="og:site_name" content="ZIWEI Tech" />
  <meta property="og:image" content="https://www.ziwei.ink/assets/images/hero-ai-platform.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ZIWEI Tech | AI Compute Infrastructure" />
  <meta name="twitter:description" content="High-performance GPU clusters, elastic AI compute platforms, and full-stack AI services for training, inference, and enterprise deployment." />
  <meta name="twitter:image" content="https://www.ziwei.ink/assets/images/hero-ai-platform.png" />`;

src = src.replace(headOld, headNew);

src = src.replace(
  `"name": "紫微智能科技（北京）有限公司",
        "alternateName": "ZIWEI Tech",
        "url": "https://www.ziwei.ink/",
        "logo": "https://www.ziwei.ink/assets/images/ziwei-logo-mark.png",
        "email": "service@ziweitech.com",
        "telephone": "+86-400-888-8888",
        "description": "领先的 AI 算能基础设施与平台服务商"
      },
      {
        "@type": "WebSite",
        "name": "紫微智能科技",
        "url": "https://www.ziwei.ink/",
        "inLanguage": "zh-CN"`,
  `"name": "ZIWEI Tech (Beijing) Co., Ltd.",
        "alternateName": "ZIWEI Tech",
        "url": "https://www.ziwei.ink/en/",
        "logo": "https://www.ziwei.ink/assets/images/ziwei-logo-mark.png",
        "email": "service@ziweitech.com",
        "telephone": "+86-400-888-8888",
        "description": "Leading AI compute infrastructure and platform provider"
      },
      {
        "@type": "WebSite",
        "name": "ZIWEI Tech",
        "url": "https://www.ziwei.ink/en/",
        "inLanguage": "en"`
);

src = src.split('class="nav-lang-link is-active" data-lang="zh" aria-current="true"').join('class="nav-lang-link" data-lang="zh" aria-current="false"');
src = src.split('class="nav-lang-link" data-lang="en" aria-current="false"').join('class="nav-lang-link is-active" data-lang="en" aria-current="true"');

const translations = [
  ['aria-label="顶部导航"', 'aria-label="Top navigation"'],
  ['aria-label="紫微智能科技首页"', 'aria-label="ZIWEI Tech home"'],
  ['alt="紫微智能科技标志"', 'alt="ZIWEI Tech logo"'],
  ['aria-label="主导航"', 'aria-label="Main navigation"'],
  ['aria-label="打开导航菜单"', 'aria-label="Open navigation menu"'],
  ['aria-label="语言切换"', 'aria-label="Language switcher"'],
  ['aria-label="移动端导航"', 'aria-label="Mobile navigation"'],
  ['aria-label="关闭菜单"', 'aria-label="Close menu"'],
  ['aria-label="站点导航"', 'aria-label="Site navigation"'],
  ['>首页<', '>Home<'],
  ['>产品服务<', '>Products<'],
  ['>解决方案<', '>Solutions<'],
  ['<a href="#advantages">平台优势</a>', '<a href="#advantages">Platform</a>'],
  ['<h2 class="section-title">平台优势</h2>', '<h2 class="section-title">Platform Advantages</h2>'],
  ['aria-label="平台优势"', 'aria-label="Platform advantages"'],
  ['>资讯中心<', '>Insights<'],
  ['>联系我们<', '>Contact<'],
  ['高性能算力 · 智能驱动未来', 'High-Performance Compute · AI-Powered Future'],
  ['aria-label="Hero 文案"', 'aria-label="Hero copy"'],
  ['<span class="title-line">紫微智能科技</span>', '<span class="title-line">ZIWEI Tech</span>'],
  ['<span class="title-line">构建领先的</span>', '<span class="title-line">Building World-Class</span>'],
  ['<span class="gradient-text">AI 算力</span>基础设施', '<span class="gradient-text">AI Compute</span> Infrastructure'],
  ['提供高性能 GPU 集群、弹性算力平台与全栈 AI 服务，<br />\n          赋能模型训练、推理加速与企业级智能化落地。', 'High-performance GPU clusters, elastic AI compute platforms, and full-stack AI services for<br />\n          model training, accelerated inference, and enterprise AI adoption.'],
  ['>申请试用<', '>Request Trial<'],
  ['>了解方案<', '>Explore Solutions<'],
  ['\n            申请试用\n', '\n            Request Trial\n'],
  ['\n            了解方案\n', '\n            Explore Solutions\n'],
  ['aria-label="AI 算力平台科技插画"', 'aria-label="AI compute platform illustration"'],
  ['alt="AI 算力平台 3D 插画：云上传、服务器集群、AI 芯片与数据看板"', 'alt="AI compute platform 3D illustration with cloud upload, servers, AI chips and dashboards"'],
  ['aria-label="大型 AI 芯片、服务器集群、云算力和数据看板组合插画"', 'aria-label="Large-scale AI chip, server cluster, cloud compute and dashboard illustration"'],
  ['aria-label="平台关键指标"', 'aria-label="Platform key metrics"'],
  ['>GPU 规模资源池<', '>GPUs in our compute pool<'],
  ['>平台可用性<', '>platform uptime<'],
  ['>企业客户信赖<', '>enterprise customers<'],
  ['>覆盖 50+<', '>50+<'],
  ['>城市与区域<', '>cities and regions worldwide<'],
  ['aria-label="产品矩阵入口"', 'aria-label="Product matrix"'],
  ['>产品矩阵入口<', '>Product Portfolio<'],
  ['探索紫微智能科技旗下两大核心产品', 'Explore ZIWEI Tech\'s two core product lines'],
  ['<h3>心语AI</h3>\n                    <h4>心理健康 AI 平台</h4>', '<h3>Xinyu AI</h3>\n                    <h4>Mental Health AI Platform</h4>'],
  ['>心理陪伴<', '>AI companion support<'],
  ['>情绪疏导<', '>Emotional support<'],
  ['>智能问答<', '>Intelligent Q&A<'],
  ['基于 AI 技术的心理健康服务平台，提供心理陪伴、情绪疏导与智能问答，守护每一份心灵健康。', 'An AI-powered mental health platform offering companion support, emotional guidance, and intelligent Q&A.'],
  ['>访问官网 <', '>Visit Site <'],
  ['>了解更多<', '>Learn More<'],
  ['<h3>算权宝</h3>\n                    <h4>AI 算能平台</h4>', '<h3>Suanquanbao</h3>\n                    <h4>AI Compute Platform</h4>'],
  ['>算力调度<', '>Compute scheduling<'],
  ['>资源管理<', '>Resource management<'],
  ['>弹性扩展<', '>Elastic scaling<'],
  ['专业的 AI 算能基础设施平台，提供高效算力调度、资源管理与弹性扩展，助力企业智能化落地。', 'A professional AI compute infrastructure platform with efficient scheduling, resource management, and elastic scaling.'],
  ['aria-label="产品服务"', 'aria-label="Products and services"'],
  ['>产品服务<', '>Products & Services<'],
  ['高性能 NVIDIA GPU 实例，灵活配置，按需使用。', 'High-performance NVIDIA GPU instances with flexible configuration and on-demand usage.'],
  ['并行文件系统，低延迟高带宽，满足大规模模型训练需求。', 'Parallel file systems with low latency and high bandwidth for large-scale model training.'],
  ['自研 RDMA 高速网络，低延迟、稳定可靠。', 'High-performance RDMA networking with low latency and high reliability.'],
  ['一站式训练平台，支持分布式训练与多种框架快速上手。', 'End-to-end training platform with distributed training and support for popular frameworks.'],
  ['高并发低延迟推理服务，支持多模型部署与弹性伸缩。', 'High-concurrency, low-latency inference with multi-model deployment and elastic scaling.'],
  ['从硬件到软件全栈交付，满足企业合规与安全需求。', 'Full-stack delivery from hardware to software for enterprise compliance and security.'],
  ['aria-label="解决方案"', 'aria-label="Solutions"'],
  ['加速模型训练与算法创新', 'Accelerate model training and algorithm innovation'],
  ['风险建模、智能投顾、反欺诈', 'Risk modeling, robo-advisory, and anti-fraud'],
  ['质量检测、预测维护、工艺优化', 'Quality inspection, predictive maintenance, and process optimization'],
  ['影像分析、药物研发、基因计算', 'Medical imaging, drug discovery, and genomics analysis'],
  ['城市治理、交通优化、安防识别', 'Urban governance, traffic optimization, and security analytics'],
  ['内容理解、推荐系统、AIGC 创作', 'Content understanding, recommendation systems, and AIGC creation'],
  ['aria-label="平台优势"', 'aria-label="Platform advantages"'],
  ['>平台优势<', '>Platform Advantages<'],
  ['>强大算力<', '>Powerful Compute<'],
  ['万卡级 GPU 资源池，<br>弹性调度，按需扩展', 'Large-scale GPU pools with<br>elastic scheduling and on-demand scaling'],
  ['>弹性灵活<', '>Elastic Scaling<'],
  ['秒级扩缩容，<br>按量计费，成本可控', 'Second-level scaling with<br>usage-based pricing and cost control'],
  ['>高性能网络<', '>High-Performance Network<'],
  ['RDMA 高速互联，<br>多机多卡高效通信', 'RDMA interconnect for<br>efficient multi-node GPU communication'],
  ['>安全可靠<', '>Secure & Reliable<'],
  ['多重安全防护，<br>数据隔离与合规保障', 'Multi-layer security with<br>data isolation and compliance'],
  ['>智能运维<', '>Intelligent Ops<'],
  ['自动化监控告警，<br>运维高效透明', 'Automated monitoring and alerts<br>for transparent operations'],
  ['>专业服务<', '>Expert Services<'],
  ['7×24 小时专家支持，<br>全生命周期服务', '24/7 expert support with<br>full lifecycle services'],
  ['aria-label="AI 算能洞察"', 'aria-label="AI compute insights"'],
  ['>AI 算能洞察<', '>AI Compute Insights<'],
  ['什么是 AI 算能基础设施？企业如何选型', 'What Is AI Compute Infrastructure? A Buyer\'s Guide'],
  ['从 GPU 算力、AI Compute 集群到训练推理平台，梳理 AI 算能建设路径与企业选型要点。', 'From GPU compute and AI compute clusters to training and inference platforms—key paths and selection criteria.'],
  ['blog/posts/what-is-ai-suan-neng.html', 'blog/posts/what-is-ai-compute.html'],
  ['blog/posts/ai-suan-neng-infrastructure-guide.html', 'blog/posts/ai-compute-infrastructure-guide.html'],
  ['企业如何选择 AI 算力平台？AI 算力平台的核心能力与建设方案', 'How to Choose an AI Compute Platform: Core Capabilities and Build Guide'],
  ['介绍 AI 算力平台的定义、六大核心能力、适用场景、选型标准，以及公有云与私有化建设方案。', 'Definitions, six core capabilities, use cases, selection criteria, and public cloud vs. private deployment options.'],
  ['AI 算能基础设施：企业 AI 落地与 GPU 算力建设指南', 'AI Compute Infrastructure: Enterprise AI Deployment and GPU Build Guide'],
  ['全面解读 GPU 算力集群、RDMA 网络、高性能存储、训练平台、推理加速与资源调度，助力企业 AI 落地。', 'A complete guide to GPU clusters, RDMA networking, storage, training platforms, inference acceleration, and resource scheduling.'],
  ['>阅读全文 →<', '>Read article →<'],
  ['>查看全部资讯<', '>View all insights<'],
  ['aria-label="常见问题"', 'aria-label="FAQ"'],
  ['>常见问题<', '>FAQ<'],
  ['紫微智能科技提供哪些核心能力？', 'What core capabilities does ZIWEI Tech provide?'],
  ['我们提供 GPU 算力实例、高性能存储、高速 RDMA 网络、模型训练平台、推理加速服务与私有化部署，覆盖从基础设施到平台运维的全栈 AI 算能能力。', 'We provide GPU compute instances, high-performance storage, high-speed RDMA networking, model training platforms, Accelerated Inference Services, and private deployment—full-stack AI compute from infrastructure to operations.'],
  ['如何申请试用算力平台？', 'How do I request a trial of the compute platform?'],
  ['点击页面「申请试用」或「立即咨询」，填写业务场景与算力需求，专属顾问将在 1 个工作日内联系您，并提供免费技术方案评估。', 'Click Request Trial or Contact Us on this page, share your use case and compute requirements, and an advisor will respond within one business day with a free assessment.'],
  ['支持哪些 GPU 与深度学习框架？', 'Which GPUs and deep learning frameworks are supported?'],
  ['平台支持 NVIDIA 主流 GPU 实例，训练平台兼容 PyTorch、TensorFlow 等常用框架，并提供分布式训练与弹性伸缩能力。', 'The platform supports mainstream NVIDIA GPU instances, PyTorch, TensorFlow, and other popular frameworks, with distributed training and elastic scaling.'],
  ['是否支持企业私有化部署？', 'Do you support enterprise private deployment?'],
  ['支持。我们可基于客户数据中心或专有云环境，提供从硬件集成、网络存储到平台软件的全栈交付，满足合规与安全要求。', 'Yes. We deliver full-stack solutions in customer data centers or dedicated cloud environments to meet compliance and security requirements.'],
  ['如何获取技术支持与计费说明？', 'How do I get technical support and pricing information?'],
  ['企业客户可享受 7×24 专家支持。计费支持按需与包年包月等多种模式，详情请致电 400-888-8888 或发送邮件至 service@ziweitech.com。', 'Enterprise customers receive 24/7 expert support. Pricing includes on-demand and subscription models. Call 400-888-8888 or email service@ziweitech.com.'],
  ['aria-label="立即体验紫微智能算力平台"', 'aria-label="Experience ZIWEI Tech AI compute platform"'],
  ['>立即体验紫微智能算力平台<', '>Experience the ZIWEI Tech AI Compute Platform<'],
  ['>申请试用，获取免费技术方案与顾问咨询<', '>Request a trial to receive a free technical assessment and expert consultation<'],
  ['>立即咨询 <', '>Contact Us <'],
  ['aria-label="页脚"', 'aria-label="Footer"'],
  ['>领先的 AI 算力基础设施与平台服务商<', '>Leading AI compute infrastructure and platform provider<'],
  ['>算力平台<', '>Compute Platform<'],
  ['>平台概览<', '>Overview<'],
  ['>使用指南<', '>User Guide<'],
  ['>开发者中心<', '>Developer Hub<'],
  ['>计费说明<', '>Pricing<'],
  ['>帮助中心<', '>Help Center<'],
  ['>关于我们<', '>About Us<'],
  ['>公司介绍<', '>Company<'],
  ['>新闻动态<', '>News<'],
  ['>加入我们<', '>Careers<'],
  ['>联系方式<', '>Contact Info<'],
  ['alt="心语AI 图标"', 'alt="Xinyu AI icon"'],
  ['aria-label="心语AI 能力标签"', 'aria-label="Xinyu AI capability tags"'],
  ['alt="心语AI 产品界面示意"', 'alt="Xinyu AI UI preview"'],
  ['alt="算权宝 图标"', 'alt="Suanquanbao icon"'],
  ['aria-label="算权宝 能力标签"', 'aria-label="Suanquanbao capability tags"'],
  ['alt="算权宝 控制台与集群示意"', 'alt="Suanquanbao console and cluster preview"'],
  ['alt="GPU 算力实例图标"', 'alt="GPU compute instances icon"'],
  ['alt="高性能存储图标"', 'alt="High-performance storage icon"'],
  ['alt="高速网络图标"', 'alt="High-speed networking icon"'],
  ['alt="模型训练平台图标"', 'alt="Model training platform icon"'],
  ['alt="推理加速服务图标"', 'alt="Accelerated inference services icon"'],
  ['alt="私有化部署图标"', 'alt="Private deployment icon"'],
  ['alt="人工智能研发解决方案示意图"', 'alt="AI R&D solution illustration"'],
  ['alt="智慧金融解决方案示意图"', 'alt="Smart finance solution illustration"'],
  ['alt="智能制造解决方案示意图"', 'alt="Smart manufacturing solution illustration"'],
  ['alt="医疗健康解决方案示意图"', 'alt="Healthcare solution illustration"'],
  ['alt="智慧城市解决方案示意图"', 'alt="Smart city solution illustration"'],
  ['alt="互联网与内容解决方案示意图"', 'alt="Internet and content solution illustration"'],
  ['推荐系统、AIGC、内容审核', 'Recommendation systems, AIGC, and content moderation'],
  ['alt="紫微智能 AI 算力核心能力示意"', 'alt="ZIWEI Tech AI compute core capabilities"'],
  ['领先 GPU 集群算力强劲稳定', 'Industry-leading GPU clusters with reliable, high-performance compute'],
  ['alt="强大算力优势图标"', 'alt="Powerful compute advantage icon"'],
  ['秒级扩容，按需付费，<br>资源利用最大化', 'Scale in seconds with pay-as-you-go pricing<br>and optimal resource utilization'],
  ['alt="弹性灵活优势图标"', 'alt="Elastic flexibility advantage icon"'],
  ['RDMA 高速互联，<br>极致低延迟', 'RDMA high-speed interconnect<br>with ultra-low latency'],
  ['alt="高性能网络优势图标"', 'alt="High-performance networking advantage icon"'],
  ['多层安全防护，<br>数据隐私合规', 'Multi-layer security with<br>data privacy and compliance'],
  ['alt="安全可靠优势图标"', 'alt="Security and reliability advantage icon"'],
  ['alt="智能运维优势图标"', 'alt="Intelligent operations advantage icon"'],
  ['alt="专业服务优势图标"', 'alt="Professional services advantage icon"'],
  ['content: "紫微智能科技";', 'content: "ZIWEI Tech";'],
  ['<span class="brand-cn">紫微智能科技</span>', '<span class="brand-cn">ZIWEI Tech</span>'],
  ['>合作伙伴<', '>Partners<'],
  ['>资质荣誉<', '>Certifications<'],
  ['>GPU 算力实例<', '>GPU Compute Instances<'],
  ['>高性能存储<', '>High-Performance Storage<'],
  ['>高速网络<', '>High-Speed Networking<'],
  ['>模型训练平台<', '>Model Training Platform<'],
  ['>推理加速服务<', '>Accelerated Inference Services<'],
  ['>私有化部署<', '>Private Deployment<'],
  ['>人工智能研发<', '>AI R&D<'],
  ['>智慧金融<', '>Smart Finance<'],
  ['>智能制造<', '>Smart Manufacturing<'],
  ['>医疗健康<', '>Healthcare<'],
  ['>智慧城市<', '>Smart Cities<'],
  ['>互联网与内容<', '>Internet & Content<'],
  ['<span>© 紫微智能科技有限公司</span>', '<span>© ZIWEI Tech Co., Ltd.</span>'],
  ['/* 仅桌面端预留滚动条槽位，避免与资讯页跳转时顶栏抖动；移动端关闭以免影响自适应 */', '/* Reserve scrollbar gutter on desktop only; disabled on mobile for responsive layout */'],
];

for (const [a, b] of translations) src = src.split(a).join(b);

// FAQ JSON-LD 等可能残留的中文引号文案
const lateFixes = [
  ['「申请试用」', 'Request Trial'],
  ['「立即咨询」', 'Contact Us'],
];
for (const [a, b] of lateFixes) src = src.split(a).join(b);

fs.writeFileSync(path.join(root, "en", "index.html"), src, "utf8");
console.log("Wrote en/index.html");
