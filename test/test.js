/**
 * @typedef {object} FooterAction
 * @property {string} text - Button text shown in the fixed footer.
 * @property {string} action - Action key emitted by the button.
 * @property {string} type - CSS class suffix used to style the button.
 */

/**
 * @typedef {object} OrderStatus
 * @property {string} code - Stable status code used by templates and logic.
 * @property {string} title - Main status title.
 * @property {string} [countdown] - Remaining payment time for pending orders.
 * @property {string} desc - Secondary status description.
 * @property {string} theme - Theme class applied to the page.
 * @property {string} amountLabel - Label shown before the amount.
 * @property {boolean} showUsage - Whether to show coupon usage information.
 * @property {FooterAction[]} footerActions - Footer actions available for this status.
 */

/**
 * @typedef {object} MiniProgramEvent
 * @property {{ dataset: Record<string, string> }} currentTarget - Dataset from the tapped node.
 */

/**
 * Payment result metadata keyed by order status.
 *
 * @type {Record<string, OrderStatus>}
 */
const STATUS_MAP = {
  success: {
    code: 'success',
    title: '支付成功',
    desc: '感谢您的光临',
    theme: 'success-theme',
    heroButton: '去喝一杯',
    amountLabel: '实付金额',
    showUsage: true,
    footerActions: [
      { text: '申请退款', action: 'refund', type: 'secondary' },
      { text: '开发票', action: 'invoice', type: 'secondary' },
    ],
  },
  refundFailed: {
    code: 'refundFailed',
    title: '退款失败',
    desc: '退款未成功，请重新发起或联系客服处理',
    theme: 'failed-theme',
    amountLabel: '实付金额',
    showUsage: true,
    footerActions: [
      { text: '重新退款', action: 'refund', type: 'secondary' },
      { text: '联系客服', action: 'service', type: 'secondary' },
    ],
  },
  refunded: {
    code: 'refunded',
    title: '已退款',
    desc: '退款金额将原路退回，请留意到账通知',
    theme: 'refund-theme',
    amountLabel: '退款金额',
    showUsage: false,
    footerActions: [
      { text: '开发票', action: 'invoice', type: 'secondary' },
    ],
  },
  pending: {
    code: 'pending',
    title: '待支付',
    countdown: '09:55',
    desc: '剩余支付时间',
    theme: 'pending-theme',
    amountLabel: '实付金额',
    showUsage: false,
    footerActions: [
      { text: '取消订单', action: 'cancel', type: 'secondary wide-secondary' },
      { text: '确认支付', action: 'pay', type: 'primary' },
    ],
  },
  cancelled: {
    code: 'cancelled',
    title: '已取消',
    desc: '订单已取消，期待您的再次光临',
    theme: 'cancel-theme',
    amountLabel: '应付金额',
    showUsage: false,
    footerActions: [
      { text: '重新购买', action: 'buyAgain', type: 'primary full' },
    ],
  },
};

Page({
  data: {
    status: STATUS_MAP.success,
    order: {
      goods: {
        image: 'https://img.alicdn.com/imgextra/i1/O1CN01h3t1lx1r7AGkjC2fH_!!6000000005582-2-tps-160-160.png',
        name: '卡券名称卡券名称卡券',
        desc: '卡券描述卡券描述卡券描述卡券描',
        count: 1,
        originPrice: '10.00',
        salePrice: '9.90',
      },
      coupon: {
        name: '券名称券名称券名称券名称',
        count: 7,
      },
      payAmount: '9.90',
      usedTimes: 7,
      leftTimes: 7,
      createdAt: '2022-04-26 14:40:40',
      storeName: '幸运咖门店幸运咖门店幸运咖门店',
      orderNo: '1518842307537592322',
    },
    detailRows: [],
  },

  /**
   * Initializes the page status from query parameters and prepares detail rows.
   *
   * @param {{ status?: string }} [query={}] - Route query from the mini program runtime.
   * @returns {void}
   */
  onLoad(query = {}) {
    const statusKey = query.status || 'success';
    this.setStatus(statusKey);
    this.setDetailRows();
  },

  /**
   * Updates the current status configuration.
   *
   * @param {string} statusKey - Key from {@link STATUS_MAP}; falls back to success when unknown.
   * @returns {void}
   */
  setStatus(statusKey) {
    this.setData({
      status: STATUS_MAP[statusKey] || STATUS_MAP.success,
    });
  },

  /**
   * Builds the order detail rows rendered in the details section.
   *
   * @returns {void}
   */
  setDetailRows() {
    const { order } = this.data;
    this.setData({
      detailRows: [
        { label: '下单时间', value: order.createdAt },
        { label: '下单门店', value: order.storeName },
        { label: '订单编号', value: order.orderNo, copyable: true },
      ],
    });
  },

  /**
   * Copies the dataset value from the tapped row to the clipboard.
   *
   * @param {MiniProgramEvent} event - Tap event carrying the value to copy.
   * @returns {void}
   */
  handleCopy(event) {
    const { value } = event.currentTarget.dataset;
    my.setClipboard({
      text: value,
      success: () => my.showToast({ content: '复制成功' }),
    });
  },

  /**
   * Handles the primary "drink" call-to-action.
   *
   * @returns {void}
   */
  handleDrink() {
    my.showToast({ content: '准备去喝一杯' });
  },

  /**
   * Handles footer actions and displays user feedback for the selected action.
   *
   * @param {MiniProgramEvent} event - Tap event carrying the action key.
   * @returns {void}
   */
  handleFooterAction(event) {
    const { action } = event.currentTarget.dataset;
    const actionText = {
      refund: '申请退款',
      invoice: '开发票',
      cancel: '取消订单',
      pay: '确认支付',
      service: '联系客服',
      buyAgain: '重新购买',
    };

    my.showToast({
      content: actionText[action] || '操作成功',
    });
  },
});
