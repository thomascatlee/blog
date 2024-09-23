---
title: 估算transformer的显存需求
date: 2024-09-20 17:02:24 +0800
author: wildcat
tags:
---
用pytroch写的很简单的transformer，训练起来却出乎意料的慢，笔记本可怜的3050被吃的死死的。
![](估算transformer的显存需求.md_Attachments/Pasted%20image%2020240920170515.png)
显存不够，训练肯定慢啊。
一般的，显存需求可以i这样计算：

$$
total_{memory} = memory_{model} + memory_{activations} + memory_{gradients}
$$
memory_model是指存储模型所有参数所需的内存。memory_activations是计算并存储在正向传播中的中间变量，在计算梯度时需要使用这些变量。因为模型中梯度的数量通常等于中间变量的数量，所以memory_activations= memory_gradients。因此可以写成：

$$
total_{memory} = memory_{model} + 2 * memory_{activations}
$$

对transformer来说，每个transformer块都包含以下结构：

```
multi_headed_attention --> layer_normalization --> MLP -->layer_normalization
```

每个multi_headed_attention元素都由键，值和查询组成。其中包括n_head个注意力头和dim个维度。MLP是包含有n_head * dim的尺寸。

$$
\begin{aligned}
memory_{model} &= memory_{multi headed attention} + memory_{MLP}\\
&= memory_{value} + memory_{key} + memory_{query} + memory_{MLP}\\
&= (n_{head} * dim)^2 + (n_{head} * dim)^2 + (n_{head} * dim)^2 + (n_{head} * dim)^2\\
&= 4*(n_{head} * dim)^2
\end{aligned}
$$
如果模型包含n个transformer单元，则memory_model还要乘n。

以上部分是静态消耗的，还要加上动态消耗的部分。
multi_headed_attention通常使用softmax，可以表达为：

```
multi_headed_attention = softmax(query * key * sequence_length) * value
```

k,q,v的维度是：

```
[batch_size, n_head, sequence_length, dim]
```

经过multi_headed_attention操作会得到如下形状：

```
[batch_size, n_head, sequence_length, sequence_length]
```

softmax需要的内存为：

$$
memory_{softmax} = batch_{size} * n_{head} * (sequence_{length})^2
$$

q* k * sequence_length操作乘以v的形状为：

```
[batch_size, n_head, sequence_length, dim]
```

MLP和v是相同的形状：

$$
\begin{aligned}
memory_{MLP} = batch_{size} * n_{head} * sequence_{length} * dim \\
memory_{value} = batch_{size} * n_{head} * sequence_{length} * dim 
\end{aligned}
$$

单个transformer单元的动态内存消耗为：

$$
\begin{aligned}
memory_{activations} 
&= memory_{softmax} + memory_{value} + memory_{MLP} \\
&= batch_{size} * n_{head} * (sequence_{length})^2  + batch_{size} * n_{head} * sequence_{length} * dim  + batch_{size} * n_{head} * sequence_{length} * dim \\
&= batch_{size} * n_{head} * sequence_{length} * (sequence_{length} + 2*dim)
\end{aligned}
$$

n个transformer单元，同样消耗也要乘n。


```
n : transformer层堆叠的数量
H : n_head 注意力头数量
D : dim 注意力头的维度
B : batch_size 批大小
S : sequence_length 输入序列的长度
```
$$
\displaylines{
memory_{model} &=& 4nH^2D^2 \\
memory_{activations} &=& nBHS(S + 2D) \\
total_{memory} &=& 4nH^2D^2 + nBHS(S + 2D)
}
$$

当输入序列足够长时，有$S+2D\rightarrow S$，因此内存消耗与输入序列长度的平方成正比。这也解释了为啥我换了长输入序列，4G显存突然的就不够了。20倍的长度，带来的是400倍的内存增长......
