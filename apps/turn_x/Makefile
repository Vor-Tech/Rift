TARGET := priv/turnx_vpx

CC := cc

OTPROOT := "/usr/local/lib64/erlang"

HDRS := include
SRCS := $(wildcard src/*.c)
DEPS := $(SRCS:%=%.d)
OBJS := $(SRCS:%=%.o)
CFLAGS := ${CFLAGS} -g -O0 -MMD -MP $(pkg-config --cflags vpx) -I${OTPROOT}/usr/include/
LDFLAGS := $(pkg-config --libs vpx) -L${OTPROOT}/usr/lib/ -lei -pthread

# Final build step, call `ld`
${TARGET}: ${OBJS}
	${CC} ${OBJS} -o $@ ${LDFLAGS}

# C objects
${OBJS}: ${SRCS}
	${CC} ${CFLAGS} -c $< -o $@

.PHONY: clean
clean:
	rm -v ${DEPS} ${OBJS} ${TARGET}

-include ${DEPS}