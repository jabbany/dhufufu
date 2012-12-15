Dhufufu (嘚呼呼~)
========
Dhufufu~ API Database for a lot of services.
Dhufufu 是一个对于几个服务API的拆解与解释，这样方便开发者们使用某些**二次开发文档不足**的站点提供的有限的API.

API Rating (API评级)
--------
APIs are rated on a level according to their ease of use and implementation details.
API将会根据使用的简易程度，和对实现方式的有限的了解（比如通量、频率）进行评级。

Levels have two independant parts, a letter grade from A-F and a number restrictor 0 - 9.
API分级分为两个独立的部分，一个A-F的评分，和一个0-9的修正分。两个部分是完全独立的。

* A : Clear, concise, documented. This type of API is not covered in this project. However there may be
links to the documentation, and tips on possible/example uses or API hacks etc.          
非常明了，使用简单，有充足开发文档。这种 API 接口基本不会在本项目中涉及，除非如果需要重新明确某些API条目的意思
或是定义一些API非正式接口/一些使用范例，以及订正API文档实际使用中可能有的一些错误。
* B : Generally clear and has limited documentation. In this type of API, you may get limited documentation
on what the Interfaces do, their return values/format. However no use cases or documentation on how to set
up connection to the api is given.          
有限的开发文档。这种API接口有有限的开发文档，可能给出了返回的数据类型/格式/API接口位置等等，但是没有介绍使用方法
或是某些返回值的意思。
* C : Not very clear, extremely limited documentation or none at all.          
不清晰，很少或没有开发文档。
* D : No API / Is a WORKING Hack          
没有开放接口。但是有可用的Hack。比如某些站点获取标题，可能有稳定的 HTML 元素包含标题内容于页面上。这种API基本能长期稳定
工作，处理开销较有API的要低，但是也不是特别巨大（可控/线性增长的难度）
* E : No API / Non-Stable Hack          
没有开放接口，不稳定Hack。比如新浪视频地址反查（给出 cid 反查上传者 user_id），这一类接口往往需要借助概率事件
（比如粗暴的进行字符串Google搜索等）。它不保证能稳定的工作，且处理开销巨大（超线性增长的难度/需引发多次网络请求）。
但是总比没有强吧。
* F : No Known API / No Known Hack / Exponential or higher difficulty in Hack          
没有开放接口，没有已知的Hack。这种需求往往没有任何办法满足，它的实现复杂度非常巨大，往往需要动用机器学习或者反复搜索。
接口可能稳定也可能不稳定，但是不管是那个情况，都无法在一个APP里面很好的嵌入。有时这种问题来自官方不给出任何信息反查途径
有时这种复杂度的

0 - 9 Corresponds to the "definitiveness" of the rating. 0 is most definitive 9 is least definitive.
0 - 9 表示API定义的权威度和可靠性，0是最可靠，9是最不可靠