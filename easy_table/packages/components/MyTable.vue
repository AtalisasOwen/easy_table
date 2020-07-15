
<script>
    import Vue from 'vue'
    import { Table } from 'element-ui';
    import { debounce, throttle } from 'throttle-debounce';

    const elTable = Vue.component(Table.name, Table);

    export default {
        name: 'MyTable',
        mixins: [elTable],
        props:{
            scroll: Function
        },
        data(){
            return{
                scrollLeft: 0,
                scrollTop: 0,
                renderRowsStart: 0,
                renderRowsEnd: 20
            }
        },
        created() {
        },
        mounted(){
        },
        watch:{
        },
        methods:{
            syncPostion: throttle(20, function() {
                const { scrollLeft, scrollTop,scrollWidth,scrollHeight, offsetWidth, offsetHeight, offsetLeft, offsetTop, clientHeight } = this.bodyWrapper;
                const { headerWrapper, footerWrapper, fixedBodyWrapper, rightFixedBodyWrapper } = this.$refs;
                if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
                if (footerWrapper) footerWrapper.scrollLeft = scrollLeft;
                if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop;
                if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop;
                const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
                if (scrollLeft >= maxScrollLeftPosition) {
                    this.scrollPosition = 'right';
                } else if (scrollLeft === 0) {
                    this.scrollPosition = 'left';
                } else {
                    this.scrollPosition = 'middle';
                }
                this.scrollLeft = scrollLeft
                this.scrollTop = scrollTop
                if (this.scroll){
                    this.scroll({scrollLeft, scrollTop,scrollWidth,scrollHeight, offsetWidth, offsetHeight, offsetLeft, offsetTop, clientHeight})
                    this.renderRowsStart = Math.round(scrollTop / 35);
                    this.renderRowsEnd = this.renderRowsStart + Math.round(clientHeight / 35)
                }

            }),
        }
    }
</script>

