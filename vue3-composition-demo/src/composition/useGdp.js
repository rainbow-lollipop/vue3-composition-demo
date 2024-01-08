import { computed, ref, watch } from "vue";
import gsap from "gsap";

/**
 * 
 * @param {*} gdpRef 
 * @param {*} maxSize 条形图变化的最大宽度
 * @returns 
 */
const colors = ["#334552", "#B34335", "#6E9FA5", "#A2C3AC", "#C8846C"];
export default function useGdp(gdpRef, maxSize) {
  const maxValue = computed(() => {
    if(gdpRef.value.length) {
      return Math.max(...gdpRef.value.map(i => i.value));
    }
    return 0;
  })

  const bars = ref([]);
  // 条形图的最终状态
  const barsTarget = computed(() => {
    return gdpRef.value.map((i,index) => ({
      ...i,
      size: i.value / maxValue.value * maxSize, // 当前i的值 / 最大值 * maxSize
      color: colors[index % colors.length]
    }))
  });

  // 将bar从当前状态变到barsTarget
  watch(
    barsTarget, 
    ()=> {
      for(let i=0; i<barsTarget.value.length; i++) {
        if(!bars.value[i]) {
          bars.value[i] = {
            ...barsTarget.value[i],
            size: 0,
            value: 0
          };
        }
        // bars.value[i]中的属性逐步变化到barsTarget.value[i]
        gsap.to(bars.value[i], {
          ...barsTarget.value[i],
          // size: barsTarget.value[i].size,
          // value: barsTarget.value[i].value,
          duration: 1
          // onUpdate() {

          // }
        })
      }
    },
    {
      deep: true
    }
  )

  return {
    bars
  }
}